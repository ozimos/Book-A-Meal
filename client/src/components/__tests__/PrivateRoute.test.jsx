/* global React:false, mount:false toJson:false */

import jwt from 'jsonwebtoken';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import PrivateRoute from '../container/PrivateRoute';

const props = {
  caterer: jest.fn(),
  customer: jest.fn(),
};

describe('PrivateRoute Component', () => {
  const catererToken = jwt.sign(
    { isCaterer: true, firstName: 'bla', userId: 'userId' },
    'secret', { expiresIn: '2h' }
  );
  const customerToken = jwt.sign(
    { isCaterer: false, firstName: 'bla', userId: 'userId' },
    'secret', { expiresIn: '2h' }
  );
  localStorage.setItem('token', JSON.stringify(catererToken));

  jest.mock('react-router-dom', () => (
    {
      Redirect: 'div',
    }
  ));

  it('renders correctly', () => {
    const options = new ReactRouterEnzymeContext();
    const setup = () => mount(<PrivateRoute {...props} />, options.get());
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
    localStorage.setItem('token', JSON.stringify(customerToken));
    const wrapper2 = setup();

    expect(toJson(wrapper2)).toMatchSnapshot();
    localStorage.removeItem('token');
    const wrapper3 = setup();

    expect(toJson(wrapper3)).toMatchSnapshot();
  });
});

