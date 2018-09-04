/* global React:false, shallow:false toJson:false */

import DashboardTableContainer from '../mealCard/DashboardTableContainer';
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
  getOrderMeals: jest.fn(),
  getOrderMealsTotals: jest.fn(),
  onFetchData: jest.fn(),
};
describe('DashboardTableContainer Component', () => {

  const setup = () => shallow(<DashboardTableContainer {...props} />);


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

