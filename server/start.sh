#!/bin/bash
START_TIME=$SECONDS
docker compose down && echo "y" | docker image prune && npm run build && docker compose up -d --build
ELAPSED_TIME=$(($SECONDS - $START_TIME))

echo "$(($ELAPSED_TIME/60)) min $(($ELAPSED_TIME%60)) sec"

./server-log.sh