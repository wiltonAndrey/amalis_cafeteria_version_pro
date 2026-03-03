<?php
require __DIR__ . '/../bootstrap.php';

if (php_sapi_name() !== 'cli') {
  fwrite(STDERR, "FAIL: restore_database_snapshot.php is CLI-only\n");
  exit(1);
}

$snapshotPath = $argv[1] ?? null;
$flags = array_slice($argv, 2);
$force = in_array('--force', $flags, true);

if (!$snapshotPath) {
  fwrite(STDERR, "FAIL: missing snapshot path\n");
  exit(1);
}

if (!$force) {
  fwrite(STDERR, "FAIL: refusing to restore without --force\n");
  exit(1);
}

$fullPath = $snapshotPath;

if (!preg_match('/^[A-Za-z]:\\\\|^\//', $snapshotPath)) {
  $fullPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $snapshotPath);
}

if (!is_file($fullPath)) {
  fwrite(STDERR, "FAIL: snapshot file not found\n");
  exit(1);
}

$raw = file_get_contents($fullPath);

if ($raw === false) {
  fwrite(STDERR, "FAIL: could not read snapshot file\n");
  exit(1);
}

$snapshot = json_decode($raw, true);

if (!is_array($snapshot)) {
  fwrite(STDERR, "FAIL: invalid snapshot JSON\n");
  exit(1);
}

if (!isset($snapshot['tables']) || !is_array($snapshot['tables'])) {
  fwrite(STDERR, "FAIL: snapshot is missing tables payload\n");
  exit(1);
}

$pdo = get_pdo();
$currentDatabase = (string) $pdo->query('SELECT DATABASE()')->fetchColumn();
$snapshotDatabase = isset($snapshot['database']) ? (string) $snapshot['database'] : '';

if ($snapshotDatabase !== '' && $snapshotDatabase !== $currentDatabase) {
  fwrite(STDERR, "FAIL: snapshot database does not match current database\n");
  exit(1);
}

$tableNames = $pdo->query(
  "SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = DATABASE()
     AND table_type = 'BASE TABLE'"
)->fetchAll(PDO::FETCH_COLUMN);
$existingTables = array_fill_keys(array_map('strval', $tableNames), true);

$restoredTables = 0;
$restoredRows = 0;

try {
  $pdo->beginTransaction();
  $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');

  foreach ($snapshot['tables'] as $tableName => $rows) {
    $tableName = (string) $tableName;

    if (!isset($existingTables[$tableName])) {
      throw new RuntimeException("missing table: {$tableName}");
    }

    if (!is_array($rows)) {
      throw new RuntimeException("invalid rows payload for table: {$tableName}");
    }

    $safeTableName = str_replace('`', '``', $tableName);
    $columns = $pdo->query("SHOW COLUMNS FROM `{$safeTableName}`")->fetchAll();

    if (!$columns) {
      throw new RuntimeException("could not inspect table: {$tableName}");
    }

    $columnNames = [];
    $autoIncrementColumn = null;

    foreach ($columns as $column) {
      $field = (string) ($column['Field'] ?? '');
      if ($field === '') {
        continue;
      }

      $columnNames[] = $field;

      if (($column['Extra'] ?? '') === 'auto_increment') {
        $autoIncrementColumn = $field;
      }
    }

    $pdo->exec("DELETE FROM `{$safeTableName}`");
    $restoredTables++;

    if ($rows !== []) {
      $insertColumns = $columnNames;
      $columnSql = implode(', ', array_map(
        static fn(string $column): string => '`' . str_replace('`', '``', $column) . '`',
        $insertColumns
      ));
      $placeholderSql = implode(', ', array_fill(0, count($insertColumns), '?'));
      $insertStmt = $pdo->prepare(
        "INSERT INTO `{$safeTableName}` ({$columnSql}) VALUES ({$placeholderSql})"
      );

      foreach ($rows as $row) {
        if (!is_array($row)) {
          throw new RuntimeException("invalid row entry for table: {$tableName}");
        }

        foreach ($insertColumns as $index => $column) {
          $value = array_key_exists($column, $row) ? $row[$column] : null;
          $paramType = $value === null ? PDO::PARAM_NULL : PDO::PARAM_STR;
          $insertStmt->bindValue($index + 1, $value, $paramType);
        }

        $insertStmt->execute();
        $restoredRows++;
      }
    }

    if ($autoIncrementColumn !== null) {
      $pdo->exec("ALTER TABLE `{$safeTableName}` AUTO_INCREMENT = 1");
    }
  }

  $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
  $pdo->commit();
} catch (Throwable $error) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }

  try {
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
  } catch (Throwable $secondaryError) {
    // Best effort reset.
  }

  fwrite(STDERR, "FAIL: " . $error->getMessage() . "\n");
  exit(1);
}

echo json_encode([
  'ok' => true,
  'database' => $currentDatabase,
  'restored_tables' => $restoredTables,
  'restored_rows' => $restoredRows,
  'snapshot' => $fullPath,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
