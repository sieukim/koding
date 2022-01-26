FROM elasticsearch:7.16.3

COPY ./user-dictionary.txt /usr/share/elasticsearch/config/analysis
COPY ./synonyms.txt /usr/share/elasticsearch/config/analysis

RUN bin/elasticsearch-plugin install analysis-nori