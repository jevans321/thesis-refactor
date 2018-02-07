
## Command Line Commands

### Start Server & Webpack
Start Server (nodemon server)
$ npm run server-dev
    
removed: Run react dev server (webpack)
$ npm run wpack-dev

### Run Data Generator
Run
$ node dataGen.js
Run with 8 Gigs max space
$ node --max-old-space-size=8192 dataGen.js

### Start PostgreSQL
Start PostgreSQL Server:
$ postgres -D /usr/local/var/postgres
Stop:
pg_ctl -D /usr/local/var/postgres stop

Start psql - postgres command line http://postgresguide.com/utilities/psql.html
$ psql -h localhost -U username databasename

test query time
\timing
Query: 'select * from table where columnName = value;'

Add Index
CREATE INDEX users_userid_index ON users (userid);
removed: CREATE INDEX regions_region_index ON regions (region);
CREATE INDEX users_ip_index ON users (ip);
CREATE INDEX regions_ip_index ON regions (ip);

Get table count
SELECT count(*) AS exact_count FROM users;

IP Exists?
select exists(SELECT ip FROM regions WHERE ip = inet '157.237.233.154');

Inner Join Users/Regions table:
SELECT users.userid, users.subscriptionstatus, regions.region FROM users INNER JOIN regions ON users.ip = regions.ip WHERE ' + req.params.userId + ' = users.userid


Remove Index:
DROP INDEX title_idx;

import Schema .sql file
\i ~/desktop/schema.sql

Quit
\q
    
### Start Redis
Start Redis Server
$ redis-server

Start Redis CLI - command line
$ redis-cli


    
