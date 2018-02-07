1. Create user object
    a. Send new user object to Client-Facing Server

2. Check if user is in Redis Cache (Can check using user ID)
    a. If user EXISTS in Redis cache
        1. Update IP and Region in 'userId' cache hash
            (try it in one line using HMSET)

    b If user does NOT exist in Redis cache
        1. Add new user data to Redis Cache (user ID, subscription status, region)


3. Check if user is in Postgres DB    

    a. If user EXISTS in Postgres DB
        // Update Postgres DB with new IP & Regions
        
        1. Check if new IP exists in PG-Regions Table
            a. If IP does NOT exist in PG-Regions Table
                1. Add IP & Region to PG-Regions Table
            b. Update/Replace IP in existing PG-Users table

    b. If user does NOT exist in Postgres DB
        1. Store new user info to Postgres DB
            a. Store IP & Region in PG-Regions Table
            b. Store user ID, IP, subscription status in PG-Users Table
        

            


