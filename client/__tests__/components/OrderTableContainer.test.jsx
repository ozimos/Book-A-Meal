/* global React:false, shallow:false toJson:false */

import OrderTableContainer from
  '../../src/components/mealCard/OrderTableContainer';
import { allOrders } from '../__mocks__/orderDataMock';

const props = {
  pagination: {
    limit: 10,
    offset: 0,
    pages: 1
  },
  currentOrderId: 'abc',
  loading: false,
  orders: allOrders.data.rows,
  addOrderToCart: jest.fn(),
  getOrderMeals: jest.fn(),
  getOrderMealsTotals: jest.fn(),
  onFetchData: jest.fn(),
};

describe('OrderTableContainer Component', () => {

  const setup = () => shallow(<OrderTableContainer {...props} />);


  it('should render without throwing an error', () => {
    const wrapper = setup();
    expect(wrapper
      .exists(<table className="table" />)).toBe(true);
  });

  it('renders correctly', () => {
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

