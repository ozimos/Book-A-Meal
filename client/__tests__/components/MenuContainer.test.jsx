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

    const props2 = { ...props, addClass: 'string' };
    const setup2 = () => shallow(<MenuContainer {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `placeOrder`', () => {
    const wrapper = setup();

    const placeOrderSpy = jest.spyOn(
      wrapper.instance(),
      'placeOrder'
    );
    wrapper.instance().placeOrder();
    expect(placeOrderSpy).toHaveBeenCalled();
  });

  it('should call `placeOrder`', () => {
    const menuError = 'error';
    const props2 = { ...props, menuError };
    const setup2 = () => shallow(<MenuContainer {...props2} />);

    const wrapper = setup2();

    const placeOrderSpy = jest.spyOn(
      wrapper.instance(),
      'placeOrder'
    );
    wrapper.instance().placeOrder();
    expect(placeOrderSpy).toHaveBeenCalled();
  });

});

