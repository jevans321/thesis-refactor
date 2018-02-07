const Router = require('koa-router');
const queries = require('../db/queries/index');
const router = new Router();
const BASE_URL = `/user`;

// router.get('/', async (ctx) => {
//   ctx.body = {
//     status: 'success',
//     message: 'hello, world!'
//   };
// })
router.get(`${BASE_URL}/:userid`, async (ctx) => {
    try {
      const userData = await queries.getUserInfoForCFS(ctx.params.userid);
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



module.exports = router;