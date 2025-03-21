#!/bin/sh

while ! nc -z db 3306 ; do
    echo "Waiting for the MySQL Server"
    sleep 3
done

mkdir logs
python manage.py migrate
python manage.py loaddata listens
python manage.py runserver 0.0.0.0:8600
