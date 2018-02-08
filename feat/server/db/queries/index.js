const knex = require('../connection');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {no_ready_check: true});

// ---- REDIS CONNECT -------- //
client.on('connect', function() {
  console.log('Connected to Redis');
});



module.exports = {

  addIpAndRegionInRegionsTablePG: (ipParam, regionParam) => {
    return knex('regions')
    .returning(['id', 'ip', 'region'])
    .insert({ip: ipParam, region: regionParam})
  },

  addIdIpAndStatusInUsersTablePG: (userIdParam, ipParam, statusParam) => {
    return knex('users')
    .returning(['userid', 'ip', 'subscriptionstatus'])
    .insert({userid: userIdParam, ip: ipParam, subscriptionstatus: statusParam})
  },

  updateIpInUsersTablePG: (useridParam, ipParam, statusParam) => {
    return knex('users')
    .where('userid', useridParam)
    .update({'ip': ipParam, 'subscriptionstatus': statusParam})
  },
  
  getUserInfoForCFS: (userIdParam) => {
    return knex('users')
    .join('regions', 'users.ip', '=', 'regions.ip')
    .select('users.userid', 'users.subscriptionstatus', 'regions.region')
    .where('users.userid', userIdParam)
  },

  valueExistsInPostgres: (value, table, column) => {
    //'select exists(SELECT userid FROM users WHERE userid = ' + req.body.userId + ')';
    let inner = knex(table).select(column).where(column, value);
    return knex.raw(inner)
    .wrap('select exists (', ')');
  },


  // -------- Redis Queries ---------
  // hashSet: (hashName, key, value, callback) => {
  //   client.HSET(hashName, key, value, redis.print);
  // },

  hashSet: (hashName, idVal, statusVal, regionVal) => {
    client.HMSET(hashName, {'userid': idVal, 'subscriptionstatus': statusVal, 'region': regionVal}, redis.print);
    
  },
  hashUpdate: (hashName, regionVal, statusVal) => {
    client.HMSET(hashName, {'region': regionVal, 'subscriptionstatus': statusVal}, redis.print);
    
  },

  // hashSetObj: () => {
  //   client.hmset("userId:0001",{a:1, b:2, c:'xxx'});
  //   console.log('Stored test object hash:....');
  // },

  hashGetValues: (hashName, callback) =>{
    client.hgetall(hashName, (err, reply) => {
      if(err) {
        console.log(err);
      } else {
        //console.log('executed query', res.rowCount);
        callback(err, [reply]);
      }
    });

    // client.HVALS(hashName, (err, reply) => {
    //   if(err) {
    //     console.log(err);
    //   } else {
    //     //console.log('executed query', res.rowCount);
    //     callback(err, reply);
    //   }
    // });    
  },
  
  hashExists: (hashName, callback) => {
    client.EXISTS(hashName, (err, reply) => {
      if(err) {
        console.log(err);
      } else {
        reply === 1 ? callback(err, true) : callback(err, false);
      }
    });
  }

  // addUserToPg: (ipParam, regionParam, statusParam) => {
  //   return knex.transaction(function (t) {
  //     return knex("regions")
  //       .transacting(t)
  //       .returning(['ip', 'region'])        
  //       .insert({ip: ipParam, region: regionParam})
  //       .then(function (response) {
  //         console.log('Regions Insert Success! ', response);
  //         return knex('users')
  //           .transacting(t)
  //           .returning(['userid', 'ip', 'subscriptionstatus'])
  //           .insert({ip: ipParam, subscriptionstatus: statusParam})
  //       })
  //       .then(t.commit)
  //       .catch(t.rollback)
  //   })
  // }

}
