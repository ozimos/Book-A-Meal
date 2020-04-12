/* global React:false, shallow:false */

import Greeting from '../../src/components/greeting/Greeting';

const props = {
  isCaterer: true,
  firstName: 'alias'
};
const props2 = {
  isCaterer: false,
  firstName: 'alias'
};
describe('Login Component', () => {

  it('renders correctly', () => {
    let wrapper = shallow(<Greeting {...props} />);
    expect(wrapper).toMatchSnapshot();
    wrapper = shallow(<Greeting {...props2} />);
    expect(wrapper).toMatchSnapshot();
  });

});

