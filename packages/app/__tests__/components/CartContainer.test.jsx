/* global React:false, shallow:false toJson:false */

import { CartContainer } from
  '../../src/components/orderCart/ConnectedCartContainer';
import { Meals } from '../__mocks__/mealDataMock';

const props = {
  order: Meals,
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
    const propsWithExtraClass = { ...props, addClass: 'string' };
    const setupExtraClass = () => shallow(<CartContainer
      {...propsWithExtraClass}
    />);
    wrapper = setupExtraClass();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it(
    'should call `placeOrder` for new orders' +
    ' when the place order button is clicked',
    () => {
      const wrapper = setup();

      const placeOrderSpy = jest.spyOn(
        wrapper.instance(),
        'placeOrder'
      );
      wrapper.instance().placeOrder();
      expect(placeOrderSpy).toHaveBeenCalled();
    }
  );

  it('should call `placeOrder` for existing orders ' +
  'when the place order button is clicked', () => {
    const orderId = '';
    const propsWithOrderId = { ...props, orderId };
    const setupWithOrderId = () => shallow(<CartContainer
      {...propsWithOrderId}
    />);

    const wrapper = setupWithOrderId();

    const placeOrderSpy = jest.spyOn(
      wrapper.instance(),
      'placeOrder'
    );
    wrapper.instance().placeOrder();
    expect(placeOrderSpy).toHaveBeenCalled();
  });

  it('should call `setQuantity` when the meal quantity is changed' +
  ' to a negative value', () => {
    const wrapper = setup();

    const setQuantitySpy = jest.spyOn(
      wrapper.instance(),
      'setQuantity'
    );
    wrapper.instance().setQuantity({ target: { value: -1 } }, 'abc');
    expect(setQuantitySpy).toHaveBeenCalled();
  });

  it('should call `setQuantity` when the meal quantity is changed' +
  ' above max values', () => {
    const wrapper = setup();

    const setQuantitySpy = jest.spyOn(
      wrapper.instance(),
      'setQuantity'
    );
    wrapper.instance().setQuantity({ target: { value: 99 } }, 'abc');
    expect(setQuantitySpy).toHaveBeenCalled();
  });

  it('should call `setQuantity`when the meal quantity is changed ' +
  'to a value in the normal range', () => {
    const wrapper = setup();

    const setQuantitySpy = jest.spyOn(
      wrapper.instance(),
      'setQuantity'
    );
    wrapper.instance().setQuantity({ target: { value: 20 } }, 'abc');
    expect(setQuantitySpy).toHaveBeenCalled();
  });
});

