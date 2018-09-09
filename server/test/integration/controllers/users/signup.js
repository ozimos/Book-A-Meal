/* eslint import/no-extraneous-dependencies: off */
import {
  expect,
  defaultPassword,
  defaultUser,
  userController
} from '../../../../testHelpers/controllerHelper';

const sampleBody = {
  firstName: 'Random',
  lastName: 'Sample',
  email: 'random.sample@gmail.com',
  password: defaultPassword,
  confirmPassword: defaultPassword
};

describe('Integration Controller User SignUp', () => {

  it('does not signup a new user with existing email', async () => {
    const body = { ...sampleBody
    };
    body.email = defaultUser.email;
    const req = {
      body
    };

    const expected = {
      message: { email: 'Email is not available' },
      statusCode: 400
    };
    const response = await userController.signUp(req);

    expect(response).to.eql(expected);
  });

  it('signs up new user using req body that passes validation, ' +
  'returns token, password not displayed', async () => {
    const req = {
      body: sampleBody
    };

    const response = await userController.signUp(req);

    expect(response.data.email).to.equal(req.body.email);
    expect(response.data.firstName).to.equal(req.body.firstName);
    expect(response.message).to.equal('Signup Successful, Login Successful');
    expect(response.statusCode).to.equal(201);
    expect(response.token).to.be.a('string');
  });
});
