/* global React:false, shallow:false toJson:false */
import { SignUp } from '../signup/ConnectedSignUp';

const props = {
  dispatch: jest.fn(),
};
describe('SignUp Component', () => {
  const setup = () => shallow(<SignUp {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect((wrapper)
      .exists(<form className="form" />)).toBe(true);
  });
  it('renders correctly', () => {
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should call `handleSubmit`', () => {
    const wrapper = setup();

    const handleSubmitSpy = jest.spyOn(
      wrapper.instance(),
      'handleSubmit'
    );
    wrapper.instance().handleSubmit();
    expect(handleSubmitSpy).toHaveBeenCalled();
  });
  it('should call `disableButton`', () => {
    const wrapper = setup();

    const disableButtonSpy = jest.spyOn(
      wrapper.instance(),
      'disableButton'
    );
    wrapper.instance().disableButton();
    expect(disableButtonSpy).toHaveBeenCalled();
  });
  it('should call `enableButton`', () => {
    const wrapper = setup();

    const enableButtonSpy = jest.spyOn(
      wrapper.instance(),
      'enableButton'
    );
    wrapper.instance().enableButton();
    expect(enableButtonSpy).toHaveBeenCalled();
  });
});

