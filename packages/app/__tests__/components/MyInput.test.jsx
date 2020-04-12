/* global React:false, shallow:false toJson:false */

import { Input } from '../../src/components/helpers/MyInput';

describe('MyInput Component', () => {
  const props = {
    getValue: jest.fn(),
    setValue: jest.fn(),
    getErrorMessage: jest.fn(),
    typeOfInput: 'text',
    placeholder: 'text',
    style: '',
  };

  const setup = () => shallow(<Input {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect(wrapper
      .exists(<div
        style={{
          color: 'red', fontSize: '1rem'
        }}
      />)).toBe(true);
  });

  it('renders correctly', () => {
    const wrapper = setup();

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `changeValue` when the input is changed', () => {
    const wrapper = setup();

    const changeValueSpy = jest.spyOn(wrapper.instance(), 'changeValue');
    wrapper.instance().changeValue({ currentTarget: { value: 'bla' } });
    expect(changeValueSpy).toHaveBeenCalled();
  });
});

