<?php
header('Content-Type: text/html');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Status</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .container { text-align: center; padding: 2rem; border: 1px solid #333; border-radius: 8px; background: #222; }
        h1 { color: #4ade80; }
        p { color: #a3a3a3; }
        a { color: #60a5fa; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1> Backend Operativo </h1>
        <p>El servidor PHP está funcionando correctamente en el puerto 8000.</p>
        <p>Esta es solo la API / Backend. Para ver la aplicación, visita:</p>
        <p><a href="http://localhost:3001" target="_blank">http://localhost:3001</a></p>
    </div>
</body>
</html>
