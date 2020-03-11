#!/bin/bash

rsync -avze ssh --exclude-from "$(dirname $0)/exclude_list.txt" $(dirname $0)/../ gustav@192.168.1.220:/home/gustav/records2/
ssh gustav@192.168.1.220 'python3 records2/manage.py collectstatic'
