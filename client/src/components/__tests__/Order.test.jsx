/* global React:false, shallow:false toJson:false */

import { Order } from '../orders/ConnectedOrder';
import { allOrders } from '../mocks/orderDataMock';
import { allMeals, meal } from '../mocks/mealDataMock';

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
  loadingMeals: false,
  orders: allOrders.data.rows,
  pendingOrders: allOrders.data.rows,
  orderMeals: allMeals.data.rows,
  menu: allMeals.data.rows,
  user: { isCaterer: true, firstName: 'user' },
  dispatch: jest.fn(),
};

describe('Order Component', () => {
  const setup = () => shallow(<Order {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect((wrapper)
      .exists(<main className="col-12 col-md-8" />)).toBe(true);
  });
  it('renders correctly', () => {
    const menu = [];
    const orders = [];
    const pagination = {
      pages: 1
    };
    const mealsPagination = {
      pages: 1
    };
    const props2 = { ...props, menu };
    const props3 = { ...props, orders };
    const props4 = { ...props, orders, menu };
    const props5 = { ...props, mealsPagination, pagination };
    let setup2 = () => shallow(<Order {...props} />);

    let wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Order {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Order {...props3} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Order {...props4} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Order {...props5} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `openCartModal`', () => {
    const wrapper = setup();

    const openCartModalSpy = jest.spyOn(wrapper.instance(), 'openCartModal');
    wrapper.instance().openCartModal();
    expect(openCartModalSpy).toHaveBeenCalled();
  });
  it('should call `closeCartModal`', () => {
    const wrapper = setup();

    const closeCartModalSpy = jest.spyOn(wrapper.instance(), 'closeCartModal');
    wrapper.instance().closeCartModal();
    expect(closeCartModalSpy).toHaveBeenCalled();
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
  it('should call `clearOrder`', () => {
    const wrapper = setup();

    const clearOrderSpy = jest.spyOn(
      wrapper.instance(),
      'clearOrder'
    );
    wrapper.instance().clearOrder();
    expect(clearOrderSpy).toHaveBeenCalled();
  });
  it('should call `postOrder`', () => {
    const wrapper = setup();

    const postOrderSpy = jest.spyOn(
      wrapper.instance(),
      'postOrder'
    );
    wrapper.instance().postOrder();
    expect(postOrderSpy).toHaveBeenCalled();
  });
  it('should call `addOrderToCart`', () => {
    const wrapper = setup();

    const addOrderToCartSpy = jest.spyOn(
      wrapper.instance(),
      'addOrderToCart'
    );
    wrapper.instance().addOrderToCart('order1');
    expect(addOrderToCartSpy).toHaveBeenCalled();
  });
  it('should call `addMealToCart`', () => {
    const wrapper = setup();

    const addMealToCartSpy = jest.spyOn(
      wrapper.instance(),
      'addMealToCart'
    );
    wrapper.instance().addMealToCart(meal.data);
    expect(addMealToCartSpy).toHaveBeenCalled();
  });
  it('should call `onFetchMealData`', () => {
    const wrapper = setup();

    const onFetchMealDataSpy = jest.spyOn(
      wrapper.instance(),
      'onFetchMealData'
    );
    wrapper.instance().onFetchMealData(meal.data);
    expect(onFetchMealDataSpy).toHaveBeenCalled();
  });
  it('should call `onFetchOrderData`', () => {
    const wrapper = setup();

    const onFetchOrderDataSpy = jest.spyOn(
      wrapper.instance(),
      'onFetchOrderData'
    );
    wrapper.instance().onFetchOrderData(meal.data);
    expect(onFetchOrderDataSpy).toHaveBeenCalled();
  });
  it('should call `getOrderMealsTotals`', () => {
    const wrapper = setup();

    const getOrderMealsTotalsSpy = jest.spyOn(
      wrapper.instance(),
      'getOrderMealsTotals'
    );
    wrapper.instance().getOrderMealsTotals(meal.data);
    expect(getOrderMealsTotalsSpy).toHaveBeenCalled();
  });
  it('should call `getOrderMeals`', () => {
    const wrapper = setup();

    const getOrderMealsSpy = jest.spyOn(
      wrapper.instance(),
      'getOrderMeals'
    );
    wrapper.instance().getOrderMeals(meal.data);
    expect(getOrderMealsSpy).toHaveBeenCalled();
  });
  it('should call `notify`', () => {
    const wrapper = setup();

    const notifySpy = jest.spyOn(
      wrapper.instance(),
      'notify'
    );
    wrapper.instance().notify(meal.data);
    expect(notifySpy).toHaveBeenCalled();
  });
});
