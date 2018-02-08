const Router = require('koa-router');
const queries = require('../db/queries/index');
const axios = require('axios');
const faker = require('faker');
const router = new Router();
const BASE_URL = `/user`;

// router.get('/', async (ctx) => {
//   ctx.body = {
//     status: 'success',
//     message: 'hello, world!'
//   };
// })
// USER & LICENSE SERVICE POST TO CLIENT-FACING-SERVER
// NEEDS WORKING CFS ENDPOINT TO TEST !!!
const sendUserDataToCFS = (data) => {
  axios.post('/user', data) 
  .then(function (response) {
    console.log("Axios Response: ", response);
  
  })
  .catch(function (error) {
    console.log(error);
  });
}


router.get(`${BASE_URL}/:userid`, async (ctx) => {
  try {
    let userData = await queries.getUserInfoForCFS(ctx.params.userid);
    if(userData.length) {
      ctx.body = {
          status: 'success',
          data: userData
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That user does not exist.'
      };
    }
  } catch (err) {
      console.log(err)
  }
})

router.post('/login', async (ctx) => {
  // create Region for new User
  let region = faker.address.country();
  
  // let newUser = {
  //   userid: ctx.request.body.userid,
  //   ip: ctx.request.body.ip,
  //   region: region,
  //   subscriptionStatus: ctx.request.body.subscriptionStatus
  // }

  // 1. Check if new IP exists in PG-Regions Table
  try {
    let ipExistsBody = await queries.valueExistsInPostgres(ctx.request.body.ip, 'regions', 'ip');
    let ipExists = ipExistsBody.rows[0].exists
    // console.log('IP In PG Regions Table Body: ', ipExists);
    // a. If IP does NOT exist in PG-Regions Table
    if(!ipExists) {
      // 1. Add IP & Region to PG-Regions Table
      try {
        let insertIpAndRegionResp = await queries.addIpAndRegionInRegionsTablePG(ctx.request.body.ip, region);
        console.log('Insert Success (IP and Region): ', insertIpAndRegionResp);
      } catch (err) {
        console.log('error', err);
      }
    }
  } catch (err) {
    console.log('error', err);
  }


  // If user exists (if userID exists) update Redis cache and Postgres DB
  if(ctx.request.body.userid) {
    // 1. Create existing user Object
    const existingUser = {
      userid: ctx.request.body.userid,
      region: region,
      subscriptionStatus: ctx.request.body.subscriptionstatus
    }
    //a. Send new user object to Client-Facing Server --------------- //
    //sendUserDataToCFS(existingUser);

    // 2. Check if user is in Redis Cache (Can check using user ID)
    queries.hashExists("userid:" + ctx.request.body.userid, (err, body) => {
      if (err) {
        return console.log(err);
      }
      let userInCache = body;
      // a. If user EXISTS in Redis cache
      if(userInCache) {
        // 1. Update Region and Subscription Status in 'userid' cache hash (IP not necessary)
        queries.hashUpdate("userid:" + ctx.request.body.userid, region, ctx.request.body.subscriptionstatus);
        // ctx.body = {
        //   cacheStatus: 'Redis Region and Subscription Updated Successfuly'
        // };
      // b If user does NOT exist in Redis cache
      } else {
        // 1. Add new user data to Redis Cache (user ID, subscription status, region)
        queries.hashSet("userid:" + ctx.request.body.userid, ctx.request.body.userid, ctx.request.body.subscriptionstatus, region);  
        // ctx.body = {
        //   cacheStatus: 'New User data added to Redis cache Successfuly'
        // };      
      }
    });
        
    // 3. Update/Replace IP and Subscription Status in existing PG-Users table
    try {
      let updateResp = await queries.updateIpInUsersTablePG(ctx.request.body.userid, ctx.request.body.ip, ctx.request.body.subscriptionstatus);
      //console.log('Update Success (IP and Subscription Status): ', updateIpResp);
      ctx.status = 200;
      ctx.body = {
        status: 'Update Success (IP and Subscription Status)',
        data: updateResp
      };
    } catch (err) {
      console.log('error', err);
    }

  } else {  // Otherwise: If user does NOT exist

    // 1. Store new user ID, IP, subscription status in PG-Users Table
    try {
      let addResp = await queries.addIdIpAndStatusInUsersTablePG(ctx.request.body.userid, ctx.request.body.ip, ctx.request.body.subscriptionstatus);
      //console.log('Insert Success (User ID, IP, and Status): ', addResp);
      ctx.status = 201;
      ctx.body = {
        status: 'Insert Success (User ID, IP, and Status)',
        data: addResp
      };
    } catch (err) {
      console.log('error', err);
    }

  }

  // try {
  //   let userData = await queries.addUserToPg(ctx.request.body.ip, region, ctx.request.body.subscriptionstatus);
  //   console.log('User data from MULTI table insert:..', userData);
  //   if (userData.length) {
  //     ctx.status = 201;
  //     ctx.body = {
  //       status: 'success',
  //       data: userData
  //     };
  //   } else {
  //     ctx.status = 400;
  //     ctx.body = {
  //       status: 'error',
  //       message: 'Something went wrong.'
  //     };
  //   }
  // } catch (err) {
  //   console.log(err)
  // }

})


module.exports = router;