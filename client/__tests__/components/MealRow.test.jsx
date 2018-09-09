/* global React:false, shallow:false toJson:false */

import MealRow from '../../src/components/orderCart/MealRow';

describe('MealRow Component', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<MealRow
      id="abc"
      title="abc"
      price={4}
      quantity={4}
      removeFromCart={jest.fn()}
      setQuantity={jest.fn()}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();

    const wrapper2 = shallow(<MealRow
      id="abc"
      title="abc"
      price={4}
      removeFromCart={jest.fn()}
      setQuantity={jest.fn()}
    />);
    expect(toJson(wrapper2)).toMatchSnapshot();

    wrapper2.find('.btn.btn-cart').simulate('click');
    expect(toJson(wrapper2)).toMatchSnapshot();

    wrapper2.find('input').simulate('change');
    expect(toJson(wrapper2)).toMatchSnapshot();
  });

});

