#!/bin/bash
docker compose exec mongo mongo

# use koding; db.postdocuments.remove({}); db.postlikedocuments.remove({}); db.postlikedailyrankingdocuments.remove({});