/* global React:false, shallow:false toJson:false */

import { TextArea } from '../../src/components/helpers/MyTextArea';

describe('MyTextArea Component', () => {

  const props = {
    getValue: jest.fn(),
    setValue: jest.fn(),
    getErrorMessage: jest.fn(),
    placeholder: 'text',
    initialValue: 'text'
  };

  const setup = () => shallow(<TextArea {...props} />);

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

  it('should call `changeValue`', () => {
    const wrapper = setup();

    const changeValueSpy = jest.spyOn(wrapper.instance(), 'changeValue');
    wrapper.instance().changeValue({ currentTarget: { value: 'bla' } });
    expect(changeValueSpy).toHaveBeenCalled();
  });
});

