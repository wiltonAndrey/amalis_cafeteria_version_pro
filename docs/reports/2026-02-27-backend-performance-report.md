# Backend Performance Report (F2.3-F2.4)

Date: 2026-02-27
Benchmark script: `scripts/benchmark_backend.ps1`
Samples per metric: 30

## Raw evidence

- Before: `docs/reports/backend-latency-before.json`
- After: `docs/reports/backend-latency-after.json`

## Results

| Metric | Before | After | Target |
|---|---:|---:|---:|
| Read p95 (ms) | 74.51 | 75.82 | <= 300 |
| Write p95 (ms) | 39.99 | 46.66 | <= 500 |
| Read avg (ms) | 57.46 | 61.24 | n/a |
| Write avg (ms) | 28.83 | 35.36 | n/a |

## Objective check

- Read p95 objective (`<= 300ms`): PASS
- Write p95 objective (`<= 500ms`): PASS

## Notes

- The after run includes additional hardening (request guards, session/origin checks, error tracing), which adds minor overhead while keeping p95 far below target.
- Runtime index checks were added in bootstrap and persistent index creation was added to `api/schema.sql`.
