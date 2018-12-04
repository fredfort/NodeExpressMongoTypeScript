import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { Response } from 'express';
import User from './user.model';
import { compareSync } from 'bcrypt';
import app from '../app';

const requester = use(chaiHttp);

describe('/User', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /*
  * Test the /GET routes
  */
  describe('/GET users', () => {
    it('it should GET an Authentification error', (done) => {
      request(app)
        .get('/user')
        .end((err, res) => {
          expect(res.status).to.eq(401);
          done();
          request(app).close() ;
        });
    });
  });

//   /*
//   * Test the /POST user
//   */
  describe('/POST users', () => {

    it('it should NOT create a new user as the password is missing', (done) => {
      request(app)
        .post('/user')
        .send({ email: 'me'})
        .end((err, res) => {
          expect(res.status).to.eq(400);
          expect(res.body.message).to.eq('could not encrypt the password');
          done();
        });
    });

    it('it should create a new user with a new id and encrypted password', (done) => {
      request(app)
        .post('/user')
        .send({ email: 'me', password: '123' })
        .end((err, res) => {
          const { email, password, _id} = res.body;
          expect(res.status).to.eq(200);
          expect(email).to.be.eq('me');
          expect(res.body).to.have.property('_id');
          expect(compareSync('123', password)).to.be.eq(true);
          done();
        });
    });
  });
});

describe('/Login', () => {
  let token: string = '';
  beforeEach((done) => {
    request(app)
      .post('/user')
      .send({ email: 'me', password: '123' })
      .end( () => done());
  });

  it('it should be able to login in', (done) => {
    request(app)
      .post('/login')
      .send({ email: 'me', password: '123' })
      .end((err, res) => {
        const { user } = res.body;
        expect(res.status).to.eq(200);
        expect(user.email).to.be.eq('me');
        expect(user.password).to.be.eq('');
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('it should return the list of users', (done) => {
    request(app)
      .get('/user')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.a('array');
        done();
      });
  });

});
