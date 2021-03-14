#!/bin/bash
npm run build || { echo 'npm build failed' ; exit 1; }
SERVER_IP=$(grep SERVER_PRIVATE_IP $(dirname $0)/../.env | xargs)
SERVER_IP=${SERVER_IP#*=}
SERVER_USER=$(grep SERVER_USER $(dirname $0)/../.env | xargs)
SERVER_USER=${SERVER_USER#*=}
rsync -avze ssh --exclude-from "$(dirname $0)/exclude_list.txt" $(dirname $0)/../ $SERVER_USER@$SERVER_IP:records2/
ssh $SERVER_USER@$SERVER_IP 'python3 records2/manage.py collectstatic'
