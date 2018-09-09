import {
  expect,
  request,
  catererTovieye,
  rootURL
} from '../../../testHelpers/appHelper';
import app from '../../../src/app';

describe('Routes Users', () => {
  const signUpUrl = `${rootURL}/auth/signup`;
  const logInUrl = `${rootURL}/auth/login`;
  const defaultPassword = 'test';

  // SignUp A User
  describe('POST /auth/signup', () => {

    const newUser = {
      firstName: 'Tovieye',
      lastName: 'Ozi',
      email: 'tovieye.ozi@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    };

    it('should signup a new user', () => request(app).post(signUpUrl)
      .send(newUser).then((res) => {
        expect(res.body.data.email).to.equal(newUser.email);
        expect(res.body.token).to.be.a('string');
      }));
  });

  // Login A User
  describe('POST /auth/login', () => {
    const credentials = {
      email: catererTovieye.email,
      password: defaultPassword,
    };

    it(
      'should login new user',
      () => request(app).post(logInUrl).send(credentials).then((res) => {
        expect(res.body.data.email).to.equal(catererTovieye.email);
        expect(res.body.token).to.be.a('string');
      })
    );
  });
});
