/* global React:false, shallow:false toJson:false */

import { Order, mapStateToProps }
  from '../../src/components/orders/ConnectedOrder';
import { initialOrderState } from '../../src/redux/reducers/orderReducer';
import { initialMenuState } from '../../src/redux/reducers/menuReducer';
import { allOrders } from '../__mocks__/orderDataMock';
import { Meals, meal } from '../__mocks__/mealDataMock';
import { menuMeals } from '../__mocks__/menuDataMock';

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
  orderMeals: Meals,
  menu: menuMeals,
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
    const propsEmptyMenu = { ...props, menu };
    const propsEmptyOrders = { ...props, orders };
    const propsEmptyOrdersMenu = { ...props, orders, menu };
    const propsNoPaginationParams = { ...props, mealsPagination, pagination };
    let snapshotSetup = () => shallow(<Order {...props} />);

    let wrapper = snapshotSetup();
    expect(toJson(wrapper)).toMatchSnapshot();
    snapshotSetup = () => shallow(<Order {...propsEmptyMenu} />);
    wrapper = snapshotSetup();

    expect(toJson(wrapper)).toMatchSnapshot();
    snapshotSetup = () => shallow(<Order {...propsEmptyOrders} />);
    wrapper = snapshotSetup();

    expect(toJson(wrapper)).toMatchSnapshot();
    snapshotSetup = () => shallow(<Order {...propsEmptyOrdersMenu} />);
    wrapper = snapshotSetup();

    expect(toJson(wrapper)).toMatchSnapshot();
    snapshotSetup = () => shallow(<Order {...propsNoPaginationParams} />);
    wrapper = snapshotSetup();

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `openCartModal` when the cart button is clicked', () => {
    const wrapper = setup();

    const openCartModalSpy = jest.spyOn(wrapper.instance(), 'openCartModal');
    wrapper.instance().openCartModal();
    expect(openCartModalSpy).toHaveBeenCalled();
  });

  it('should call `closeCartModal` when the cart' +
  ' close button is clicked', () => {
    const wrapper = setup();

    const closeCartModalSpy = jest.spyOn(wrapper.instance(), 'closeCartModal');
    wrapper.instance().closeCartModal();
    expect(closeCartModalSpy).toHaveBeenCalled();
  });

  it('should call `closeMealDetailModal` when' +
  ' the meal detail modal close button is clicked', () => {
    const wrapper = setup();

    const closeMealDetailModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeMealDetailModal'
    );
    wrapper.instance().closeMealDetailModal();
    expect(closeMealDetailModalSpy).toHaveBeenCalled();
  });

  it('should call `clearOrder` when the clear order button is clicked', () => {
    const wrapper = setup();

    const clearOrderSpy = jest.spyOn(
      wrapper.instance(),
      'clearOrder'
    );
    wrapper.instance().clearOrder();
    expect(clearOrderSpy).toHaveBeenCalled();
  });

  it('should call `postOrder` when the post order button is clicked', () => {
    const wrapper = setup();

    const postOrderSpy = jest.spyOn(
      wrapper.instance(),
      'postOrder'
    );
    wrapper.instance().postOrder();
    expect(postOrderSpy).toHaveBeenCalled();
  });

  it('should call `addOrderToCart` when the edit' +
  ' order button is clicked', () => {
    const wrapper = setup();

    const addOrderToCartSpy = jest.spyOn(
      wrapper.instance(),
      'addOrderToCart'
    );
    wrapper.instance().addOrderToCart('order3');
    expect(addOrderToCartSpy).toHaveBeenCalled();
  });

  it('should call `addMealToCart` when the add' +
  ' to cart button is clicked', () => {
    const wrapper = setup();

    const addMealToCartSpy = jest.spyOn(
      wrapper.instance(),
      'addMealToCart'
    );
    wrapper.instance().addMealToCart(meal);
    expect(addMealToCartSpy).toHaveBeenCalled();
  });

  it('should call `onFetchMealData` when the meal' +
  ' detail table pagination button is clicked', () => {
    const wrapper = setup();

    const onFetchMealDataSpy = jest.spyOn(
      wrapper.instance(),
      'onFetchMealData'
    );
    wrapper.instance().onFetchMealData(meal);
    expect(onFetchMealDataSpy).toHaveBeenCalled();
  });

  it('should call `onFetchOrderData` when the order' +
  '  table pagination button is clicked', () => {
    const wrapper = setup();

    const onFetchOrderDataSpy = jest.spyOn(
      wrapper.instance(),
      'onFetchOrderData'
    );
    wrapper.instance().onFetchOrderData(meal);
    expect(onFetchOrderDataSpy).toHaveBeenCalled();
  });

  it('should call `getOrderMealsTotals` when the order' +
  '  table row is clicked ', () => {
    const wrapper = setup();

    const getOrderMealsTotalsSpy = jest.spyOn(
      wrapper.instance(),
      'getOrderMealsTotals'
    );
    wrapper.instance().getOrderMealsTotals(meal);
    expect(getOrderMealsTotalsSpy).toHaveBeenCalled();
  });

  it('should call `getOrderMeals` when the order' +
  '  table row is clicked ', () => {
    const wrapper = setup();

    const getOrderMealsSpy = jest.spyOn(
      wrapper.instance(),
      'getOrderMeals'
    );
    wrapper.instance().getOrderMeals(meal);
    expect(getOrderMealsSpy).toHaveBeenCalled();
  });

  it('should call `notify` when the add' +
  ' to cart button is clicked', () => {
    const wrapper = setup();

    const notifySpy = jest.spyOn(
      wrapper.instance(),
      'notify'
    );
    wrapper.instance().notify(meal);
    expect(notifySpy).toHaveBeenCalled();
  });

  it('should call `handleMenuPaginationClick` when the menu' +
  '  section pagination button is clicked', () => {
    const wrapper = setup();

    const handleMenuPaginationClickSpy = jest.spyOn(
      wrapper.instance(),
      'handleMenuPaginationClick'
    );
    wrapper.instance().handleMenuPaginationClick({ selected: 1 });
    expect(handleMenuPaginationClickSpy).toHaveBeenCalled();
  });

  it('should call `removeMealFromCart` when the meal delete' +
  ' button is clicked', () => {
    const wrapper = setup();

    const removeMealFromCartSpy = jest.spyOn(
      wrapper.instance(),
      'removeMealFromCart'
    );
    wrapper.instance().removeMealFromCart('order1');
    expect(removeMealFromCartSpy).toHaveBeenCalled();
  });

  it('should map state to props', () => {
    const initialState = {
      loginReducer: {
        user: {
          isCaterer: true,
          firstName: 'Name'
        }
      },
      menuReducer: {
        ...initialMenuState,
      },
      orderReducer: {
        ...initialOrderState,
      },
    };

    const tree = mapStateToProps(initialState);
    expect(tree).toMatchSnapshot();
  });
});
