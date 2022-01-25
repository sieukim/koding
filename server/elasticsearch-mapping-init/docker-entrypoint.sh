#!/bin/bash

for i in {30..0}; do
    if curl elasticsearch:9200; then
        curl -XPUT elasticsearch:9200/koding-post -d @elastic-config.json -H 'Content-Type: application/json';
        break;
    fi
    sleep 2
done