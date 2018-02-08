process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../feat/server/index');
const knex = require('../feat/server/db/connection');

describe('routes : index', () => {

    beforeEach(() => {
      return knex.migrate.rollback()
      .then(() => { return knex.migrate.latest(); })
      .then(() => { return knex.seed.run(); });
    });
  
    afterEach(() => {
      return knex.migrate.rollback();
    });
  

    describe('GET /user/:userid', () => {
        it('should respond with a single user along with their region', (done) => {
          chai.request(server)
          .get('/user/1')
          .end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 200 status code
            res.status.should.equal(200);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"status": "success"}
            res.body.status.should.equal('success');
            // the JSON response body should have a
            // key-value pair of {"data": [1 user object]}
            res.body.data.length.should.eql(1);
            // the first object in the data array should
            // have the right keys
            res.body.data[0].should.include.keys(
              'userid', 'region', 'subscriptionstatus'
            )
            res.body.data.should.eql([
                {
                  'userid': 1,
                  'subscriptionstatus': 'Expired',
                  'region': 'Canada'
                }
            ]);
            done();
          });
        });

        it('should throw an error if the user does not exist', (done) => {
            chai.request(server)
            .get('/user/9')
            .end((err, res) => {
              // there should an error
              should.exist(err);
              // there should be a 404 status code
              res.status.should.equal(404);
              // the response should be JSON
              res.type.should.equal('application/json');
              // the JSON response body should have a
              // key-value pair of {"status": "error"}
              res.body.status.should.eql('error');
              // the JSON response body should have a
              // key-value pair of {"message": "That user does not exist."}
              res.body.message.should.eql('That user does not exist.');
              done();
            });
          });

    }); // End of describe: GET /user/:userid

    // describe('POST /login', () => {
    //   it('should update Redis cache with region and subscription data', (done) => {
    //     chai.request(server)
    //     .post('/login')
    //     .send({
    //       'userid': 1,
    //       'ip': '192.255.101.153',
    //       'subscriptionstatus': 'Subscribed'
    //     })
    //     .end((err, res) => {
    //       should.not.exist(err);
    //       res.type.should.equal('application/json');
    //       res.body.cacheStatus.should.eql('Redis Region and Subscription Updated Successfuly');
    //       done();
    //     });
    //   });
    // })

    // describe('POST /login', () => {
    //   it('should add new user to Redis cache', (done) => {
    //     chai.request(server)
    //     .post('/login')
    //     .send({
    //       'userid': 11000000,
    //       'ip': '192.255.101.200',
    //       'subscriptionstatus': 'Expired'
    //     })
    //     .end((err, res) => {
    //       should.not.exist(err);
    //       res.type.should.equal('application/json');
    //       res.body.cacheStatus.should.eql('New User data added to Redis cache Successfuly');
    //       done();
    //     });
    //   });
    // })

    describe('POST /login', () => {
      it('should update users table with new IP and subscription status', (done) => {
        chai.request(server)
        .post('/login')
        .send({
          userid: 5,
          ip: '123.200.14.7',
          subscriptionstatus: 'Expired'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('Update Success (IP and Subscription Status)');
          res.body.data.should.equal(1);
          done();
        });
      });
    });

    describe('POST /login', () => {
      it('should return the user that was added', (done) => {
        chai.request(server)
        .post('/login')
        .send({
          ip: '123.200.14.8',
          subscriptionstatus: 'None'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.status.should.eql('Insert Success (User ID, IP, and Status)');
          res.body.data[0].should.include.keys(
            'userid', 'ip', 'subscriptionstatus'
          );
          done();
        });
      });
    });


    // describe('POST /login', () => {
    //   it('should return the user that was added', (done) => {
    //     chai.request(server)
    //     .post('/login')
    //     .send({
    //       ip: '123.200.14.8',
    //       subscriptionstatus: 'Subscribed'
    //     })
    //     .end((err, res) => {
    //       // there should be no errors
    //       should.not.exist(err);
    //       // there should be a 201 status code
    //       // (indicating that something was "created")
    //       res.status.should.equal(201);
    //       // the response should be JSON
    //       res.type.should.equal('application/json');
    //       // the JSON response body should have a
    //       // key-value pair of {"status": "success"}
    //       res.body.status.should.eql('success');
    //       // the JSON response body should have a
    //       // key-value pair of {"data": 1 movie object}
    //       res.body.data[0].should.include.keys(
    //         'userid', 'ip', 'subscriptionstatus'
    //       );
    //       done();
    //     });
    //   });
    // });
  
});