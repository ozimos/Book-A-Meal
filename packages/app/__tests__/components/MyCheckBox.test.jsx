/* global React:false, shallow:false toJson:false */

import { CheckBox } from '../../src/components/helpers/MyCheckBox';

describe('MyCheckBox Component', () => {

  const props = {
    getValue: jest.fn(),
    setValue: jest.fn(),
    getErrorMessage: jest.fn(),
    typeOfInput: 'checkbox',
    style: '',
  };

  const setup = () => shallow(<CheckBox {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect(wrapper
      .exists(<input type="checkbox" />)).toBe(true);
  });

  it('renders correctly', () => {
    const wrapper = setup();

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `changeValue` when the input is changed', () => {
    const wrapper = setup();

    const changeValueSpy = jest.spyOn(wrapper.instance(), 'changeValue');
    wrapper.instance().changeValue({ target: { checked: true } });
    expect(changeValueSpy).toHaveBeenCalled();
  });
});

