<?php

if (!function_exists('menu_taxonomy_fold_text')) {
  function menu_taxonomy_fold_text(string $value): string
  {
    $text = trim($value);
    if ($text === '') {
      return '';
    }

    if (function_exists('mb_strtolower')) {
      $text = mb_strtolower($text, 'UTF-8');
    } else {
      $text = strtolower($text);
    }

    if (function_exists('iconv')) {
      $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
      if (is_string($converted) && $converted !== '') {
        $text = $converted;
      }
    }

    $text = str_replace(
      ['á', 'à', 'ä', 'â', 'ã', 'é', 'è', 'ë', 'ê', 'í', 'ì', 'ï', 'î', 'ó', 'ò', 'ö', 'ô', 'õ', 'ú', 'ù', 'ü', 'û', 'ñ', 'ç'],
      ['a', 'a', 'a', 'a', 'a', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'n', 'c'],
      $text
    );

    $text = preg_replace('/[^a-z0-9]+/', ' ', $text) ?? $text;
    return trim($text);
  }
}

if (!function_exists('menu_taxonomy_slugify')) {
  function menu_taxonomy_slugify(string $value): string
  {
    return str_replace(' ', '_', menu_taxonomy_fold_text($value));
  }
}

if (!function_exists('menu_taxonomy_derive_beverage_subcategory')) {
  function menu_taxonomy_derive_beverage_subcategory(string $productName): string
  {
    $key = menu_taxonomy_fold_text($productName);

    if ($key === 'infusion' || $key === 'infusion especial') {
      return 'infusiones';
    }

    if ($key === 'zumo de naranja' || strpos($key, 'zumo ') === 0) {
      return 'zumos';
    }

    if ($key === 'cola cao') {
      return 'cacao';
    }

    return 'cafes';
  }
}

if (!function_exists('menu_taxonomy_normalize_category')) {
  function menu_taxonomy_normalize_category(string $category, string $productName = ''): array
  {
    $trimmed = trim($category);
    $slug = menu_taxonomy_slugify($trimmed);

    if ($slug === 'cafes' || $slug === 'cafe') {
      return [
        'category' => 'bebidas',
        'subcategory' => menu_taxonomy_derive_beverage_subcategory($productName),
      ];
    }

    return [
      'category' => $trimmed,
      'subcategory' => null,
    ];
  }
}

if (!function_exists('menu_taxonomy_normalize_subcategory')) {
  function menu_taxonomy_normalize_subcategory($value): ?string
  {
    $text = trim((string) ($value ?? ''));
    if ($text === '') {
      return null;
    }

    $slug = menu_taxonomy_slugify($text);
    if ($slug === '') {
      return null;
    }

    return $slug;
  }
}

if (!function_exists('menu_taxonomy_normalize_product_taxonomy')) {
  function menu_taxonomy_normalize_product_taxonomy(string $name, string $category, $subcategory = null): array
  {
    $normalized = menu_taxonomy_normalize_category($category, $name);
    $normalizedCategory = (string) ($normalized['category'] ?? $category);
    $normalizedSubcategory = menu_taxonomy_normalize_subcategory($subcategory);

    if ($normalizedCategory === 'bebidas') {
      if ($normalizedSubcategory === null) {
        $normalizedSubcategory = (string) ($normalized['subcategory'] ?? menu_taxonomy_derive_beverage_subcategory($name));
      }
    } else {
      $normalizedSubcategory = $normalizedSubcategory;
    }

    return [
      'category' => $normalizedCategory,
      'subcategory' => $normalizedSubcategory,
    ];
  }
}
