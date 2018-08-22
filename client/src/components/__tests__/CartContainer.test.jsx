/* global React:false, shallow:false toJson:false */

import { CartContainer } from '../orderCart/ConnectedCartContainer';
import { allOrders } from '../mocks/orderDataMock';

describe('CartContainer Component', () => {

  it('should render without throwing an error', () => {
    expect(shallow(<CartContainer
      order={allOrders.data}
      MealRow={jest.fn()}
      clearCart={jest.fn()}
      dispatch={jest.fn()}
      orderId=""
    />)
      .exists(<table className="table" />)).toBe(true);
  });
  it('renders correctly', () => {
    const wrapper = shallow(<CartContainer
      order={allOrders.data}
      MealRow={jest.fn()}
      clearCart={jest.fn()}
      dispatch={jest.fn()}
      orderId=""
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

