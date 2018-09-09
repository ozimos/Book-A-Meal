/* global React:false, shallow:false toJson:false */

import { Dashboard, mapStateToProps }
  from '../../src/components/dashboard/ConnectedDashboard';
import { dashboardInitialState }
  from '../../src/redux/reducers/dashboardReducer';
import { allOrders } from '../__mocks__/orderDataMock';

import { allMeals } from '../__mocks__/mealDataMock';


const props = {
  pagination: {
    limit: 10,
    offset: 0,
    pages: 1
  },
  mealsPagination: {
    limit: 5,
    offset: 0,
    pages: 1
  },
  total: { revenue: 100, orders: 2, users: 1 },
  daysTotal: { revenue: 100, orders: 2, users: 1 },
  loadingMeals: false,
  orderConnecting: false,
  orders: allOrders.data.rows,
  orderMeals: allMeals.data.rows,
  user: { isCaterer: true, firstName: 'user' },
  dispatch: jest.fn(),
};

describe('Dashboard Component', () => {
  const setup = () => shallow(<Dashboard {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect((wrapper)
      .exists(<table className="table" />)).toBe(true);

  });

  it('renders correctly', () => {
    const orders = [];
    const pagination = {
      pages: 1
    };
    const mealsPagination = {
      pages: 1
    };
    const props2 = { ...props, orders };
    const props3 = { ...props, mealsPagination };
    const props4 = { ...props, pagination };
    let setup2 = () => shallow(<Dashboard {...props} />);

    let wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Dashboard {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Dashboard {...props3} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Dashboard {...props4} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `onFetchMealData`', () => {
    const wrapper = setup();

    const onFetchMealDataSpy = jest.spyOn(
      wrapper.instance(),
      'onFetchMealData'
    );
    wrapper.instance().onFetchMealData({ page: 1, pageSize: 10 });
    expect(onFetchMealDataSpy).toHaveBeenCalled();
  });

  it('should call `onFetchOrderData`', () => {
    const wrapper = setup();

    const onFetchOrderDataSpy = jest.spyOn(
      wrapper.instance(),
      'onFetchOrderData'
    );
    wrapper.instance().onFetchOrderData({ page: 1, pageSize: 10 });
    expect(onFetchOrderDataSpy).toHaveBeenCalled();
  });

  it('should call `getOrderMealsTotals`', () => {
    const wrapper = setup();

    const getOrderMealsTotalsSpy = jest.spyOn(
      wrapper.instance(),
      'getOrderMealsTotals'
    );
    wrapper.instance().getOrderMealsTotals('abc');
    expect(getOrderMealsTotalsSpy).toHaveBeenCalled();
  });

  it('should call `getOrderMeals`', () => {
    const wrapper = setup();

    const getOrderMealsSpy = jest.spyOn(
      wrapper.instance(),
      'getOrderMeals'
    );
    wrapper.instance().getOrderMeals('abc');
    expect(getOrderMealsSpy).toHaveBeenCalled();
  });

  it('should call `closeMealDetailModal`', () => {
    const wrapper = setup();

    const closeMealDetailModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeMealDetailModal'
    );
    wrapper.instance().closeMealDetailModal();
    expect(closeMealDetailModalSpy).toHaveBeenCalled();
  });

  it('should call `searchUpdated`', () => {
    const wrapper = setup();

    const searchUpdatedSpy = jest.spyOn(
      wrapper.instance(),
      'searchUpdated'
    );
    wrapper.instance().searchUpdated('abc');
    expect(searchUpdatedSpy).toHaveBeenCalled();
  });

  it('should map state to props', () => {
    const initialState = {
      loginReducer: {
        authenticated: true,
        user: {
          isCaterer: true
        }
      },
      mealsReducer: {
        meals: []
      },
      dashboardReducer: {
        ...dashboardInitialState
      }
    };

    const tree = mapStateToProps(initialState);
    expect(tree).toMatchSnapshot();
  });
});

