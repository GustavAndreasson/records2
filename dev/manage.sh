#!/bin/bash
docker exec -it $(docker ps | grep records2_web | awk '{print $1}') python manage.py $@