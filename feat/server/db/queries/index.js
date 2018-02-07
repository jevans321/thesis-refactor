const knex = require('../connection');

// module.exports = {

//     getUserInfoForCFS: function(userIdParam) {
//     return knex('users')
//     .join('regions', 'users.ip', '=', 'regions.ip')
//     .select('users.userid', 'users.subscriptionstatus', 'regions.region')
//     .where('users.userid', userIdParam)
//   }

// }
function getUserInfoForCFS(userIdParam) {
    return knex('users')
    .join('regions', 'users.ip', '=', 'regions.ip')
    .select('users.userid', 'users.subscriptionstatus', 'regions.region')
    .where('users.userid', userIdParam)
  }

  module.exports = {
    getUserInfoForCFS
  };