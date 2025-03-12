#!/bin/bash
docker exec -it $(docker ps | grep records2[-_]web | awk '{print $1}') python manage.py $@
