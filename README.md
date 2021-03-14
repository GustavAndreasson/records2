# Records 2
Browse records from Discogs by user or artist with advanced and fast filtering and sorting possibilities.

[skivsamling.se](http://skivsamling.se)

## Installation
Copy env.template to .env with the appropriate changes

### Production
```sh
sh install/deploy.sh
```
On server:
```sh
python3 manage.py createsuperuser
python3 manage.py migrate
sudo service apache restart
```

Crontab:
```sh
*/3 * * * * cd /directory/of/records2/;python3 manage.py updaterecords 30 >> /directory/of/records2/logs/updateRecords.log 2>&1
0 2 * * * cd /directory/of/records2/;python3 manage.py updatecollections >> /directory/of/records2/logs/updateCollections.log 2>&1
```

Apache configuration:
```sh
Alias /static /directory/of/records2/static
<Directory /directory/of/records2/static>
        Require all granted
</Directory>

<Directory /directory/of/records2/records2>
        <Files wsgi.py>
                Require all granted
        </Files>
</Directory>

```

### Development
```sh
npm run dev
python3 manage.py createsuperuser
python3 manage.py migrate
python3 manage.py runserver
```
