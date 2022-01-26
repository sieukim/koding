FROM elasticsearch:7.16.3

COPY ./user-dictionary.txt /usr/share/elasticsearch/config
COPY ./synonyms-koding.txt /usr/share/elasticsearch/config

RUN bin/elasticsearch-plugin install analysis-nori