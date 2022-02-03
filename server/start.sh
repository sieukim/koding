#!/bin/bash
docker compose down && echo "y" | docker image prune && docker compose up -d --build