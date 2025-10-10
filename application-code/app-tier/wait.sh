#!/bin/bash

echo " Waiting for MySQL to be ready..."

# Wait until MySQL responds
until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" --silent; do
  echo "  MySQL is unavailable - sleeping..."
  sleep 2
done

echo " MySQL is up - starting backend server!"
npm start
