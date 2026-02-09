<?php

final class Response
{
  public static function json(array $payload, int $status = 200): void
  {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);

    if (php_sapi_name() !== 'cli') {
      exit;
    }
  }
}
