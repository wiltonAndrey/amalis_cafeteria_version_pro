<?php

declare(strict_types=1);

$projectRoot = dirname(__DIR__);
$distRoot = $projectRoot . DIRECTORY_SEPARATOR . 'dist';
$distRootReal = realpath($distRoot);
$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if ($requestPath !== '/' && str_starts_with($requestPath, '/api/')) {
    $apiFile = $projectRoot . str_replace('/', DIRECTORY_SEPARATOR, $requestPath);
    if (is_file($apiFile)) {
        return false;
    }

    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'API endpoint not found.';
    return true;
}

$resolveDistPath = static function (string $path) use ($distRoot, $distRootReal): ?string {
    $sanitized = ltrim($path, '/');
    $candidate = $distRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $sanitized);
    $resolved = realpath($candidate);

    if ($resolved === false || !is_file($resolved)) {
        return null;
    }

    if ($distRootReal === false || !str_starts_with($resolved, $distRootReal)) {
        return null;
    }

    return $resolved;
};

$mimeTypes = [
    'css' => 'text/css; charset=UTF-8',
    'gif' => 'image/gif',
    'html' => 'text/html; charset=UTF-8',
    'ico' => 'image/x-icon',
    'jpeg' => 'image/jpeg',
    'jpg' => 'image/jpeg',
    'js' => 'application/javascript; charset=UTF-8',
    'json' => 'application/json; charset=UTF-8',
    'png' => 'image/png',
    'svg' => 'image/svg+xml',
    'txt' => 'text/plain; charset=UTF-8',
    'webp' => 'image/webp',
    'woff2' => 'font/woff2',
];

$sendFile = static function (string $filePath) use ($mimeTypes): bool {
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $contentType = $mimeTypes[$extension] ?? 'application/octet-stream';
    $normalizedPath = str_replace('\\', '/', $filePath);
    $acceptEncoding = strtolower((string) ($_SERVER['HTTP_ACCEPT_ENCODING'] ?? ''));
    $isCompressible = in_array($extension, ['css', 'html', 'js', 'json', 'svg', 'txt'], true);
    $shouldCompress = $isCompressible
        && function_exists('gzencode')
        && str_contains($acceptEncoding, 'gzip');
    $isHashedAsset = str_contains($normalizedPath, '/dist/assets/')
        && preg_match('/-[A-Za-z0-9_-]{8,}\.[^.]+$/', basename($filePath)) === 1;
    $isHtmlDocument = $extension === 'html';
    $content = file_get_contents($filePath);

    if ($content === false) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=UTF-8');
        echo 'Unable to read build artifact.';
        return true;
    }

    if ($shouldCompress) {
        $compressedContent = gzencode($content, 6, ZLIB_ENCODING_GZIP);
        if ($compressedContent !== false) {
            $content = $compressedContent;
            header('Content-Encoding: gzip');
            header('Vary: Accept-Encoding');
        }
    }

    http_response_code(200);
    header('Content-Type: ' . $contentType);
    header($isHashedAsset
        ? 'Cache-Control: public, max-age=31536000, immutable'
        : ($isHtmlDocument ? 'Cache-Control: no-cache' : 'Cache-Control: public, max-age=600'));
    header('Content-Length: ' . (string) strlen($content));
    echo $content;

    return true;
};

$distFile = $resolveDistPath($requestPath);
if ($distFile !== null) {
    return $sendFile($distFile);
}

$indexFile = $distRoot . DIRECTORY_SEPARATOR . 'index.html';
if (!is_file($indexFile)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Build not found. Run npm run build first.';
    return true;
}

// Inject HTTP Link preload headers for route-specific LCP images
// This lets the browser discover the LCP image before HTML parsing begins
if (preg_match('#^/carta(/|$)#', $requestPath)) {
    header('Link: </images/products/Tostada-Tomate-Atun.webp>; rel=preload; as=image; type=image/webp; fetchpriority=high', false);
} elseif ($requestPath === '/' || $requestPath === '/index.html') {
    header('Link: </images/nuestra_historia/pan-recien-horneado-santa-pola.webp>; rel=preload; as=image; type=image/webp; fetchpriority=high', false);
}

return $sendFile($indexFile);
