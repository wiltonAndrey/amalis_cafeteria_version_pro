
import React from 'react';
import ReactDOM from 'react-dom/client';
import stylesheetHref from './index.css?url';

const ensureGlobalStyles = (): void => {
  if (document.querySelector('link[data-app-styles="true"]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = stylesheetHref;
  link.setAttribute('data-app-styles', 'true');
  document.head.appendChild(link);
};

const pathname = window.location.pathname;
const isHomeRoute = pathname === '/' || pathname.endsWith('/index.html');
const isMenuRoute = pathname === '/carta' || pathname === '/carta/' || pathname.endsWith('/carta/index.html');

if (!isHomeRoute) {
  ensureGlobalStyles();
}

window.addEventListener('load', () => ensureGlobalStyles(), { once: true });

const mountApp = async (): Promise<void> => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Could not find root element to mount to');
  }

  const root = ReactDOM.createRoot(rootElement);

  if (isHomeRoute) {
    const { default: HomeApp } = await import('./HomeApp');
    root.render(
      <React.StrictMode>
        <HomeApp />
      </React.StrictMode>
    );
    return;
  }

  if (isMenuRoute) {
    const { default: MenuApp } = await import('./MenuApp');
    root.render(
      <React.StrictMode>
        <MenuApp />
      </React.StrictMode>
    );
    return;
  }

  const { BrowserRouter } = await import('react-router-dom');
  const { default: App } = await import('./App');

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

void mountApp();
