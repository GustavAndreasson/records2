#!/bin/bash
docker exec -it $(docker ps | grep records2-web | awk '{print $1}') python manage.py $@
