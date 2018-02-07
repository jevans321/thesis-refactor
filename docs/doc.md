

Apply migration to databases (Add tables)
$ knex migrate:latest --env development
$ knex migrate:latest --env test

Populate databases with data from seed files
$ knex seed:run --env development
$ knex seed:run --env test