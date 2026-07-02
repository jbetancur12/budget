#!/bin/sh
set -e

echo "Running migrations..."
node dist/scripts/run-migration.js

echo "Starting server..."
exec "$@"
