# Sunflower-assignment

## Running:
run db: docker compose up -d db

run schema: docker exec -i $(docker ps -qf "ancestor=postgres:14") psql -U postgres -d leaderboard < models/schema.sql

run api: docker compose up --build api

check: curl http://localhost:3000/leaderboard/top/10
