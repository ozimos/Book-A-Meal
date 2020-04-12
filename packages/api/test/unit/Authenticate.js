/* eslint import/no-extraneous-dependencies: off */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';

import Authenticate from '../../src/middleware/Authenticate';

chai.use(sinonChai);

describe('Test Authentication middleware', () => {
  const next = () => {};

  it('should return error message if no token is provided', () => {
    const request = {
      headers: {}
    };
    const req = mockReq(request);
    const res = mockRes();

    Authenticate.isUser(req, res, next);

    expect(res.status).to.be.calledWith(401);
    expect(res.json).to.be.calledWith({ message: 'No token provided.' });

  });

  it('should return error message if bad token is provided', () => {
    const request = {
      headers: {
        authorization: 'Bearer'
      }
    };
    const req = mockReq(request);
    const res = mockRes();

    Authenticate.isUser(req, res, next);

    expect(res.json).to.be.calledWith({ message: 'jwt must be provided' });
    expect(res.status).to.be.calledWith(403);

  });

  it('should return error message if user is not caterer', () => {
    const request = {
      decoded: {}
    };
    const req = mockReq(request);
    const res = mockRes();
    Authenticate.isAdmin(req, res, next);

    expect(res.status).to.be.calledWith(403);
    expect(res.json).to.be
      .calledWith({ message: 'You Are not Authorized to access this page!' });

  });
});
