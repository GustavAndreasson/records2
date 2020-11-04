# Records 2
Browse records from Discogs by user or artist with advanced and fast filtering and sorting possibilities.

#Installation
Copy env.template to .env with the appropriate changes

Production:
```sh
npm run build
sh install/deploy.sh
```

Development:
```sh
npm run dev
python3 manage.py runserver
```

Crontab:
```sh
*/3 * * * * cd /directory/of/records2/;python3 manage.py updaterecords 30 >> /directory/of/records2/logs/updateRecords.log 2>&1
0 2 * * * cd /directory/of/records2/;python3 manage.py updatecollections >> /directory/of/records2/logs/updateCollections.log 2>&1
```
