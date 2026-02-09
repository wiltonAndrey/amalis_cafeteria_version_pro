<?php

final class Validator
{
  public static function string_trim($value): string
  {
    return trim((string) ($value ?? ''));
  }

  public static function required($value): bool
  {
    return self::string_trim($value) !== '';
  }

  public static function numeric($value): bool
  {
    return is_numeric($value);
  }

  public static function positive($value): bool
  {
    return is_numeric($value) && (float) $value > 0;
  }
}
