# #!/bin/bash

# echo " Waiting for MySQL to be ready..."

# # Wait until MySQL responds
# until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" --silent; do
#   echo "  MySQL is unavailable - sleeping..."
#   sleep 2
# done

# echo " MySQL is up - starting backend server!"
# npm start


!/bin/bash
echo " Waiting for RDS to be ready..."

until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" --silent; do
  echo "  RDS not ready yet... retrying in 3s..."
  sleep 3
done

echo " RDS is up - starting backend server!"
npm start
