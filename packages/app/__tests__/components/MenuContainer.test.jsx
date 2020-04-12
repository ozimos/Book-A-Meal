/* global React:false, shallow:false toJson:false */

import { MenuContainer } from
  '../../src/components/orderCart/ConnectedMenuContainer';
import { menuMeals } from '../__mocks__/menuDataMock';

const props = {
  menu: menuMeals,
  menuError: '',
  dispatch: jest.fn(),
  notify: jest.fn(),
  postMenu: jest.fn(),
  clearMenu: jest.fn(),
};

describe('MenuContainer Component', () => {
  const setup = () => shallow(<MenuContainer {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect(wrapper
      .exists(<table className="table" />)).toBe(true);
  });

  it('renders correctly', () => {

    let wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();

    const propsWithExtraClass = { ...props, addClass: 'string' };
    const setupWithExtraClass = () => shallow(<MenuContainer
      {...propsWithExtraClass}
    />);
    wrapper = setupWithExtraClass();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `placeOrder` when the place order button is clicked', () => {
    const wrapper = setup();

    const placeOrderSpy = jest.spyOn(
      wrapper.instance(),
      'placeOrder'
    );
    wrapper.instance().placeOrder();
    expect(placeOrderSpy).toHaveBeenCalled();
  });

  it('should call `placeOrder` when there is menu error' +
  ' and menu is not posted ', () => {
    const menuError = 'error';
    const propsWithMenuError = { ...props, menuError };
    const setupWithMenuError = () => shallow(<MenuContainer
      {...propsWithMenuError}
    />);

    const wrapper = setupWithMenuError();

    const placeOrderSpy = jest.spyOn(
      wrapper.instance(),
      'placeOrder'
    );
    wrapper.instance().placeOrder();
    expect(placeOrderSpy).toHaveBeenCalled();
  });

});

