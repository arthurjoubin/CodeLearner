---
name: cloudflare-d1
description: Access and query Cloudflare D1 database using wrangler CLI
license: MIT
compatibility: opencode
metadata:
  category: database
  platform: cloudflare
---

## What I do

Help access and query Cloudflare D1 databases using the wrangler CLI.

## Prerequisites

- Wrangler CLI installed locally (`npm install wrangler`)
- D1 database already created in Cloudflare dashboard
- Database name configured in `wrangler.toml`

## Basic Commands

### List tables in remote database
```bash
npx wrangler d1 execute <database-name> --remote --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### Get table schema
```bash
nnpx wrangler d1 execute <database-name> --remote --command="PRAGMA table_info(table_name)"
```

### Query data
```bash
npx wrangler d1 execute <database-name> --remote --command="SELECT * FROM users LIMIT 10"
```

### Execute on local database (dev)
Remove `--remote` flag:
```bash
npx wrangler d1 execute <database-name> --command="SELECT * FROM users"
```

## Common Patterns

### Check if column exists
```bash
npx wrangler d1 execute <database-name> --remote --command="SELECT sql FROM sqlite_master WHERE type='table' AND name='users'"
```

### Count rows
```bash
npx wrangler d1 execute <database-name> --remote --command="SELECT COUNT(*) as count FROM table_name"
```

## Important Notes

- Always use `--remote` for production database
- Local database is in `.wrangler/state/v3/d1/`
- Commands return JSON with `results`, `success`, and `meta` fields
- Use single quotes for strings in SQL queries

## Troubleshooting

If `wrangler` command not found, use `npx wrangler` instead.
