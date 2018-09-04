/* global React:false, shallow:false toJson:false */

import OrderTableContainer from '../mealCard/OrderTableContainer';
import { allOrders } from '../mocks/orderDataMock';

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
    const newOrders = [...allOrders.data.rows];
    newOrders[0].updatedAt = new Date();
    const props2 = { ...props, orders: newOrders };

    let setup2 = () => shallow(<OrderTableContainer {...props} />);
    let wrapper = setup2();

    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<OrderTableContainer {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

