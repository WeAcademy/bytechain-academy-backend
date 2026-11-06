-- A separate database so e2e tests never touch your development data.
SELECT 'CREATE DATABASE bytechain_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bytechain_test')\gexec
