#!/bin/bash

rsync -avze ssh --exclude-from "$(dirname $0)/exclude_list.txt" $(dirname $0)/../ gustav@192.168.1.220:/var/www/records2/
