FROM ubuntu:20.04

# Install packages
RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install curl -y

COPY docker-entrypoint.sh /
COPY elastic-config.json /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]