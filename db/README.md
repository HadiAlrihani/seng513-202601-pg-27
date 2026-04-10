## Instructions of how to run the database schema and seed using the Dockerfile.
## Instructions of how to see that the seed has populated the database.

1. Open the directory containing the seed.sql, init.sql, and Dockerfile
2. Ensure that docker desktop or whatever else you may be using is running.
3. Before starting the container, ensure you have no container named postgresdb
    - If you do, replace postgresdb with some other name, or remove the other one
4. Run the following commands from the terminal:
    - 1. docker build -t wormly-db .

    - 2. docker run -d --name postgresdb -e POSTGRES_USER=group27 -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=wormly_db -p 5432:5432 wormly-db

    - 3. docker exec -it postgresdb bash

    - 4. psql -U group27 -d wormly_db

    - 5. \dt

    - 6. SELECT * FROM {table name};

4. To exit and remove the container:

    - 1. \q (to exit the datbase wormly_db)

    - 2. exit (to return to the project directory)

    - 3. docker stop postgresdb

    - 4. docker rm postgresdb