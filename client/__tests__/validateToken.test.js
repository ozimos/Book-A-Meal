import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import addDays from 'date-fns/add_days';
import MockDate from 'mockdate';
import validateToken from '../src/services/validateToken';

config();

const token = jwt.sign(
  { isCaterer: true },
  process.env.TOKEN_PASSWORD, { expiresIn: '1h' }
);
const nextDay2 = addDays(new Date(), 2);

describe('validate token', () => {

  it('returns true if token has not expired', () => {
    expect(validateToken(token).valid).toBe(true);
  });

  it('returns data in token', () => {
    expect(validateToken(token).isCaterer).toBe(true);
  });

  describe('when token has expired', () => {

    beforeEach(() => {
      MockDate.set(nextDay2);
    });
    afterEach(() => {
      MockDate.reset();
    });

    it('returns false', () => {
      expect(validateToken(token).valid).toBe(false);
    });

  });
});
