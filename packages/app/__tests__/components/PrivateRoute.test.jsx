/* global React:false, mount:false toJson:false rrcMock:false */

import jwt from 'jsonwebtoken';
import PrivateRoute from '../../src/components/container/PrivateRoute';

const props = {
  caterer: jest.fn(),
  customer: jest.fn(),
};

describe('PrivateRoute Component', () => {

  const catererToken = jwt.sign(
    { isCaterer: true, firstName: 'Tovieye', userId: 'userId' },
    'secret', { expiresIn: '2h' }
  );

  const customerToken = jwt.sign(
    { isCaterer: false, firstName: 'Tovieye', userId: 'userId' },
    'secret', { expiresIn: '2h' }
  );

  localStorage.setItem('token', JSON.stringify(catererToken));

  jest.mock('react-router-dom', () => (
    {
      Redirect: 'div',
    }
  ));

  it('renders correctly', () => {

    const options = rrcMock;
    const setup = () => mount(<PrivateRoute {...props} />, options.get());
    const wrapperCaterer = setup();
    expect(toJson(wrapperCaterer)).toMatchSnapshot();
    localStorage.setItem('token', JSON.stringify(customerToken));

    const wrapperCustomer = setup();
    expect(toJson(wrapperCustomer)).toMatchSnapshot();
    localStorage.removeItem('token');

    const wrapperNoToken = setup();
    expect(toJson(wrapperNoToken)).toMatchSnapshot();
  });
});

