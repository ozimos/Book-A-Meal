/* global React:false, shallow:false toJson:false */

import MealRow from '../../src/components/orderCart/MealRow';

describe('MealRow Component', () => {

  it('renders correctly', () => {
    const wrapperWithAllProps = shallow(<MealRow
      id="abc"
      title="abc"
      price={4}
      quantity={4}
      removeFromCart={jest.fn()}
      setQuantity={jest.fn()}
    />);
    expect(toJson(wrapperWithAllProps)).toMatchSnapshot();

    const wrapper = shallow(<MealRow
      id="abc"
      title="abc"
      price={4}
      removeFromCart={jest.fn()}
      setQuantity={jest.fn()}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.find('.btn.btn-cart').simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.find('input').simulate('change');
    expect(toJson(wrapper)).toMatchSnapshot();
  });

});

