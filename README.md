# Three Tier Application
This application uses a Terraform to deploy a three tier application

This is an updated code from the original code: [AWS Three Tier Web Architecture Workshop](https://github.com/aws-samples/aws-three-tier-web-architecture-workshop/tree/main)

## Table of Contents
- [Application code](#Application-code)
- [Terraform](#Terraform)
- [Getting Started](#getting-started)

## Application code
The `appliation-code` directory contains source codes for the `app-tier` and `web-tier`

## Terraform
The `terraform` directory contains `infra` to create the resources with terraform and `s3-db` to create the remote backend

## Getting Started
After a `terraform apply` on the `infra` directory, do these manual changes on the aws console. The instances will be accessed via ssm
- On the web-tier instance, update `nginx.conf` with the internal loadbalancer dns.
``` 
 sudo -su ec2-user
 cd ~
 sudo vi /etc/nginx/nginx.conf
 sudo systemctl restart nginx
 ```

- On the app-tier instance, configure the database
```
 sudo -su ec2-user
 cd ~
 mysql -h CHANGE-TO-YOUR-RDS-ENDPOINT -u CHANGE-TO-USER-NAME -p # get the username and password from aws secret manager `db-cred`
 CREATE DATABASE webappdb;
 USE webappdb;
 CREATE TABLE IF NOT EXISTS transactions(id INT NOT NULL
     -> AUTO_INCREMENT, amount DECIMAL(10,2), description
     -> VARCHAR(100), PRIMARY KEY(id));
 INSERT INTO transactions (amount,description) VALUES ('400','groceries');

 # The output should look like this
 +----+--------+-------------+
 | id | amount | description |
 +----+--------+-------------+
 |  1 | 400.00 | groceries   |
 +----+--------+-------------+
 1 row in set (0.00 sec)
 
```