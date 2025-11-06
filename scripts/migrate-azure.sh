#!/bin/bash

# Azure PostgreSQL Migration Script
# This script runs the database migration on your Azure PostgreSQL database

echo "🚀 Starting Azure PostgreSQL migration..."

# Get Azure AD token
echo "🔑 Getting Azure AD token..."
export AZURE_AD_TOKEN=$(az account get-access-token --resource https://ossrdbms-aad.database.windows.net --query accessToken --output tsv)

if [ -z "$AZURE_AD_TOKEN" ]; then
    echo "❌ Failed to get Azure AD token. Make sure you're logged in with 'az login'"
    exit 1
fi

echo "✅ Azure AD token obtained"

# Set PostgreSQL environment variables
export PGHOST=uxdbpoc.postgres.database.azure.com
export PGUSER=jade_davila.azure
export PGPORT=5432
export PGDATABASE=postgres
export PGPASSWORD="$AZURE_AD_TOKEN"
export PGSSLMODE=require

# Run the SQL migration
echo "📊 Running database migration..."
psql "sslmode=require" -f supabase/migrations/001_initial_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
else
    echo "❌ Migration failed. Check the error messages above."
    exit 1
fi

echo "🎉 Azure PostgreSQL database is ready!"
