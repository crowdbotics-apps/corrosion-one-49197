#!/bin/bash

python manage.py collectstatic --no-input
python manage.py migrate --noinput
python manage.py cities_light

waitress-serve --port=$PORT corrosion_one_49197.wsgi:application
