/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  defaultPassword,
  defaultUser,
  userController
} from '../../../../testHelpers/controllerHelper';

const sampleBody = {
  email: defaultUser.email,
  password: defaultPassword
};

describe('Integration Controller User Login', () => {

  it('does not login unknown user that passes validation', async () => {
    const body = { ...sampleBody };
    body.email = 'tomvie@gmail.com';
    const req = { body };
    const expected = {
      message: { email: 'Incorrect email or password' },
      statusCode: 404
    };
    const response = await userController.login(req);

    expect(response).to.eql(expected);
  });

  it('does not login valid user with wrong password', async () => {
    const body = { ...sampleBody };
    body.password = 'Wrong Password';
    const req = { body };

    const expected = {
      message: { password: 'Incorrect email or password' },
      statusCode: 404
    };
    const response = await userController.login(req);

    expect(response).to.eql(expected);
  });

  it('login valid user, returns token, password not displayed', async () => {
    const req = { body: sampleBody };

    const response = await userController.login(req);

    expect(response.data.email).to.equal(defaultUser.email);
    expect(response.data.firstName).to.equal(defaultUser.firstName);
    expect(response.message).to.equal('Login Successful');
    expect(response.statusCode).to.equal(200);
    expect(response.token).to.be.a('string');
  });
});
