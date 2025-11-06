#!/bin/bash

# Secure server startup script
# Reads password from secure .pgpass file instead of storing in .env

# Extract password from .pgpass file
PGPASS_FILE="$HOME/.pgpass"

if [ ! -f "$PGPASS_FILE" ]; then
  echo "❌ Error: ~/.pgpass file not found"
  echo "Please create it with: echo 'uxdbpoc.postgres.database.azure.com:5432:postgres:uxadmin:YOUR_PASSWORD' > ~/.pgpass && chmod 0600 ~/.pgpass"
  exit 1
fi

# Extract password for uxdbpoc
DB_PASSWORD=$(grep "uxdbpoc.postgres.database.azure.com" "$PGPASS_FILE" | cut -d: -f5)

if [ -z "$DB_PASSWORD" ]; then
  echo "❌ Error: Could not find uxdbpoc password in ~/.pgpass"
  exit 1
fi

# Export password as environment variable (only for this session)
export DB_PASSWORD="$DB_PASSWORD"

echo "🚀 Starting Express server with secure credentials..."
pnpm dev:server
