FROM python:3.12-slim-bookworm AS deps

ARG YOUR_ENV

ENV YOUR_ENV=${YOUR_ENV} \
  PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  POETRY_VERSION=1.5.1

# System deps:
RUN pip install "poetry==$POETRY_VERSION" chuy

# adds pm command to improve devs ergonomics
RUN echo '#!/bin/bash' >> /bin/pm && \
    echo '# Run "python manage.py" with all arguments after it' >> /bin/pm && \
    echo 'python manage.py "$@"' >> /bin/pm && \
    chmod +x /bin/pm

# Copy only requirements to cache them in docker layer
WORKDIR /opt/webapp


# libpq-dev and python3-dev help with psycxxopg2
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3-dev libpq-dev gcc curl binutils libproj-dev gdal-bin g++ \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*
  # You can add additional steps to the build by appending commands down here using the
  # format `&& <command>`. Remember to add a `\` at the end of LOC 12.
  # WARNING: Changes to this file may cause unexpected behaviors when building the app.
  # Change it at your own risk.


ADD backend/poetry.lock backend/pyproject.toml /opt/webapp/

# Project initialization:
RUN poetry config virtualenvs.create false \
  && poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi


FROM deps AS release

WORKDIR /opt/webapp
ADD . /opt/webapp/

ARG SECRET_KEY
RUN python3 manage.py collectstatic --no-input

# Run the image as a non-root user
RUN adduser --disabled-password --gecos "" django

RUN touch .env

USER django
#CMD sleep 999999
CMD waitress-serve --port=$PORT corrosion_one_49197.wsgi:application

