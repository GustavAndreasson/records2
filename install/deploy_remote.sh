#!/bin/bash

rsync -avze ssh --exclude-from "$(dirname $0)/exclude_list.txt" $(dirname $0)/../ gustav@212.85.79.94:/home/gustav/records2/
ssh gustav@212.85.79.94 'python3 records2/manage.py collectstatic'
