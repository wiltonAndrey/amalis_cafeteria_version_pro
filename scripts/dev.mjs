#!/usr/bin/env node
import { spawn, execFile } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const argv = process.argv.slice(2);
const isHealthcheck = argv.includes('--healthcheck');

const FRONTEND_HOST = '127.0.0.1';
const FRONTEND_PORT = 3000;
const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = 8000;

const FRONTEND_URL = `http://${FRONTEND_HOST}:${FRONTEND_PORT}/`;
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function portOpen(host, port, timeoutMs = 1200) {
  return await new Promise((resolve) => {
    const socket = new net.Socket();

    const done = (ok) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));

    socket.connect(port, host);
  });
}

async function waitForPort(host, port, timeoutMs, label) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await portOpen(host, port, 900)) return true;
    await sleep(250);
  }
  throw new Error(`Timeout waiting for ${label} on ${host}:${port}`);
}

function pipeWithPrefix(stream, prefix) {
  if (!stream) return;
  let buffer = '';
  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.length === 0) {
        process.stdout.write('\n');
        continue;
      }
      process.stdout.write(`${prefix}${line}\n`);
    }
  });
  stream.on('end', () => {
    if (buffer.length > 0) process.stdout.write(`${prefix}${buffer}\n`);
  });
}

function spawnProcess(name, command, args) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: process.env,
  });

  pipeWithPrefix(child.stdout, `[${name}] `);
  pipeWithPrefix(child.stderr, `[${name}] `);

  return child;
}

async function killProcessTree(pid) {
  if (!pid) return;
  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      execFile('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true }, () => resolve());
    });
    return;
  }

  // Best effort for non-windows.
  try {
    process.kill(pid, 'SIGTERM');
  } catch {}
  await sleep(1500);
  try {
    process.kill(pid, 'SIGKILL');
  } catch {}
}

let shuttingDown = false;
let frontend = null;
let backend = null;
const started = { frontend: false, backend: false };

async function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;

  // Only stop processes we started (avoid killing a dev server that was already running).
  const kills = [];
  if (started.frontend && frontend?.pid) kills.push(killProcessTree(frontend.pid));
  if (started.backend && backend?.pid) kills.push(killProcessTree(backend.pid));
  await Promise.all(kills);

  process.exit(code);
}

process.on('SIGINT', () => void shutdown(0));
process.on('SIGTERM', () => void shutdown(0));

async function main() {
  const frontendUp = await portOpen(FRONTEND_HOST, FRONTEND_PORT, 900);
  const backendUp = await portOpen(BACKEND_HOST, BACKEND_PORT, 900);

  if (frontendUp && backendUp) {
    console.log('Frontend and backend already running:');
    console.log(`- Frontend: ${FRONTEND_URL}`);
    console.log(`- Backend:  ${BACKEND_URL}`);
    return;
  }

  if (!backendUp) {
    backend = spawnProcess('php', 'php', ['-S', '127.0.0.1:8000', '-t', '.']);
    started.backend = true;
    backend.on('exit', (code) => {
      if (!shuttingDown) void shutdown(typeof code === 'number' ? code : 1);
    });
  } else {
    console.log(`Backend already running: ${BACKEND_URL}`);
  }

  if (!frontendUp) {
    const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
    frontend = spawnProcess('vite', process.execPath, [viteBin, '--host', '0.0.0.0', '--port', '3000']);
    started.frontend = true;
    frontend.on('exit', (code) => {
      if (!shuttingDown) void shutdown(typeof code === 'number' ? code : 1);
    });
  } else {
    console.log(`Frontend already running: ${FRONTEND_URL}`);
  }

  try {
    if (started.backend) await waitForPort(BACKEND_HOST, BACKEND_PORT, 15000, 'backend');
    if (started.frontend) await waitForPort(FRONTEND_HOST, FRONTEND_PORT, 30000, 'frontend');
  } catch (error) {
    console.error(String(error?.message ?? error));
    await shutdown(1);
    return;
  }

  console.log('Ready:');
  console.log(`- Frontend: ${FRONTEND_URL}`);
  console.log(`- Backend:  ${BACKEND_URL}`);

  if (isHealthcheck) {
    // If we started the processes for the healthcheck, clean them up.
    await shutdown(0);
  }

  // Keep running until Ctrl+C.
  // eslint-disable-next-line no-constant-condition
  while (true) await sleep(3600_000);
}

main().catch(async (error) => {
  console.error(error);
  await shutdown(1);
});
