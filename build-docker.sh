#!/bin/bash
echo "version: $1"
docker build . -t dguplms/problembank-client:$1
docker push dguplms/problembank-client:$1
