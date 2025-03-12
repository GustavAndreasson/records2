# Records 2

Browse records from Discogs by user or artist with advanced and fast filtering and sorting possibilities.

[skivsamling.se](http://skivsamling.se)

## Installation

Copy env.template to .env with the appropriate changes

### Development

```sh
npm install
npm run dev
docker-compose up --build
```

### Production

On server run:

```sh
cd /directory/of/records2/
python3 -m venv venv
```

Add a file .env (copy of env.template) in the records2 directory with correct links to mysql and redis.

Then run this from development machine (use switch '-r' if not on local network):

```sh
sh dev/deploy.sh
```

Recommended crontab:

```sh
*/3 * * * * cd /directory/of/records2/ && /directory/of/records2/venv/bin/python manage.py updaterecords 30 >> /directory/of/records2/logs/updateRecords.log 2>&1
0 2 * * * cd /directory/of/records2/ && /directory/of/records2/venv/bin/python manage.py updatecollections >> /directory/of/records2/logs/updateCollections.log 2>&1
```

Apache configuration:

```sh
Alias /static /directory/of/records2/static
<Directory /directory/of/records2/static>
        Require all granted
</Directory>

Alias /media /directory/of/records2/media
<Directory /directory/of/records2/media>
        Require all granted
</Directory>

<Directory /directory/of/records2/records2>
        <Files wsgi.py>
                Require all granted
        </Files>
</Directory>

WSGIDaemonProcess records2 python-path=/directory/of/records2 python-home=/directory/of/records2/venv
WSGIProcessGroup records2
WSGIScriptAlias / /directory/of/records2/records2/wsgi.py
```

## Admin interface

Create admin user with:

```sh
python manage.py createsuperuser
```

Admin interface can be reached at yoururl/admin

## Import artists

```sh
wget http://discogs-data.s3-us-west-2.amazonaws.com/data/2022/discogs_20220101_artists.xml.gz
gunzip discogs_20220101_artists.xml.gz
python manage.py importartistxml discogs_20220101_artists.xml
```

Adjust file name to get most current artists dump.

## Download covers for created, but not updated records

```sh
python manage.py downloadcovers 100
```

Number limits number of covers that will be downloaded.
