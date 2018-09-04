/* global React:false, shallow:false toJson:false */

import { CartContainer } from '../orderCart/ConnectedCartContainer';
import { rows } from '../mocks/mealDataMock';

const props = {
  order: rows,
  orderId: 'abc',
  orderError: '',
  dispatch: jest.fn(),
  notify: jest.fn(),
  MealRow: jest.fn(),
  clearCart: jest.fn(),
};

describe('CartContainer Component', () => {

  const setup = () => shallow(<CartContainer {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect(wrapper
      .exists(<table className="table" />)).toBe(true);
  });
  it('renders correctly', () => {
    let wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
    const props2 = { ...props, addClass: 'string' };
    const setup2 = () => shallow(<CartContainer {...props2} />);
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
    const orderId = '';
    const props2 = { ...props, orderId };
    const setup2 = () => shallow(<CartContainer {...props2} />);

    const wrapper = setup2();

    const placeOrderSpy = jest.spyOn(
      wrapper.instance(),
      'placeOrder'
    );
    wrapper.instance().placeOrder();
    expect(placeOrderSpy).toHaveBeenCalled();
  });
  it('should call `setQuantity` for negative values', () => {
    const wrapper = setup();

    const setQuantitySpy = jest.spyOn(
      wrapper.instance(),
      'setQuantity'
    );
    wrapper.instance().setQuantity({ target: { value: -1 } }, 'abc');
    expect(setQuantitySpy).toHaveBeenCalled();
  });
  it('should call `setQuantity` for high values', () => {
    const wrapper = setup();

    const setQuantitySpy = jest.spyOn(
      wrapper.instance(),
      'setQuantity'
    );
    wrapper.instance().setQuantity({ target: { value: 99 } }, 'abc');
    expect(setQuantitySpy).toHaveBeenCalled();
  });
  it('should call `setQuantity`', () => {
    const wrapper = setup();

    const setQuantitySpy = jest.spyOn(
      wrapper.instance(),
      'setQuantity'
    );
    wrapper.instance().setQuantity({ target: { value: 20 } }, 'abc');
    expect(setQuantitySpy).toHaveBeenCalled();
  });
});

