
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {userid: 1, subscriptionstatus: 'Expired', ip: '123.200.14.4'},
        {userid: 2, subscriptionstatus: 'None', ip: '123.200.14.5'},
        {userid: 3, subscriptionstatus: 'Subscribed', ip: '123.200.14.5'},
        {userid: 4, subscriptionstatus: 'Subscribed', ip: '123.200.14.5'},
        {userid: 5, subscriptionstatus: 'Subscribed', ip: '123.200.14.6'},
        {userid: 6, subscriptionstatus: 'Subscribed', ip: '123.200.14.6'}
      ]);
    });
};
