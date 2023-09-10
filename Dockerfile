FROM python:3.9.15-alpine3.16
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 0
WORKDIR /app/
COPY requirements.txt /app/
RUN apk update && \
    apk add --no-cache python3 libjpeg mariadb-connector-c-dev netcat-openbsd && \
    apk add --no-cache --virtual .tmp python3-dev gcc mariadb-dev libc-dev zlib-dev jpeg-dev
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
RUN apk del .tmp
COPY . /app/