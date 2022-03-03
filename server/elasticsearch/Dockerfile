FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.0

COPY ./user-dictionary.txt /usr/share/elasticsearch/config
COPY ./synonyms-koding.txt /usr/share/elasticsearch/config

RUN bin/elasticsearch-plugin install analysis-nori