#!/bin/bash
npm run build || { echo 'npm build failed' ; exit 1; }
SERVER_IP=$(grep SERVER_PRIVATE_IP $(dirname $0)/../.env | xargs)
while getopts r option
do
  case $option in
  r) SERVER_IP=$(grep SERVER_PUBLIC_IP $(dirname $0)/../.env | xargs);;
  ?) printf "Usage: %s: [-r] (-r for remote deploy)\n" $0
    exit 2;;
  esac
done
SERVER_IP=${SERVER_IP#*=}
echo $SERVER_IP
SERVER_USER=$(grep SERVER_USER $(dirname $0)/../.env | xargs)
SERVER_USER=${SERVER_USER#*=}
SYNC=$(rsync -avze ssh --exclude-from "$(dirname $0)/exclude_list.txt" $(dirname $0)/../ $SERVER_USER@$SERVER_IP:records2/)
echo "$SYNC"
if echo "$SYNC" | grep -q "requirements.txt"; then
  echo 'records2/venv/bin/pip install -r records2/requirements.txt'
  ssh $SERVER_USER@$SERVER_IP 'records2/venv/bin/pip install -r records2/requirements.txt'
fi
if echo "$SYNC" | grep -q "migrations"; then
  echo 'records2/venv/bin/python records2/manage.py migrate'
  ssh $SERVER_USER@$SERVER_IP 'records2/venv/bin/python records2/manage.py migrate'
fi
if echo "$SYNC" | grep -q "frontend"; then
  echo 'records2/venv/bin/python records2/manage.py collectstatic'
  ssh $SERVER_USER@$SERVER_IP 'records2/venv/bin/python records2/manage.py collectstatic'
fi
if echo "$SYNC" | grep -q ".py"; then
  echo 'sudo service apache2 restart'
  ssh -t $SERVER_USER@$SERVER_IP 'sudo service apache2 restart'
fi
