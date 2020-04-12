/* global React:false, shallow:false toJson:false */

import NotFound from '../../src/components/helpers/NotFound';

describe('NotFound Component', () => {

  jest.mock('react-router-dom', () => (
    {
      Link: 'div',
    }
  ));

  it('renders correctly', () => {
    const wrapper = shallow(<NotFound />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

