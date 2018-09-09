/* global React:false, shallow:false toJson:false */
import { SignUp, mapStateToProps }
  from '../../src/components/signup/ConnectedSignUp';

const props = {
  dispatch: jest.fn(),
  authenticated: false,
};

describe('SignUp Component', () => {

  const setup = () => shallow(<SignUp {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect((wrapper)
      .exists(<form className="form" />)).toBe(true);
  });

  it('renders correctly', () => {

    const props2 = {
      dispatch: jest.fn(),
      authenticated: true
    };
    const props3 = {
      dispatch: jest.fn(),
      signupError: { password: 'wrong password' }
    };
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
    const wrapper2 = shallow(<SignUp {...props2} />);
    expect(toJson(wrapper2)).toMatchSnapshot();
    const wrapper3 = shallow(<SignUp {...props3} />);
    expect(toJson(wrapper3)).toMatchSnapshot();
  });

  it('should call `componentDidUpdate`', () => {
    const serverFeedbackSpy = jest.spyOn(
      SignUp.prototype,
      'serverFeedback'
    );
    const componentDidUpdateSpy = jest.spyOn(
      SignUp.prototype,
      'componentDidUpdate'
    );
    serverFeedbackSpy.mockImplementation(() => jest.fn());
    const wrapper = setup();
    wrapper.setState({ prevSignupError: { password: 'wrong password' },
      newError: true });
    wrapper.instance().componentDidUpdate();
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  it('should call `handleSignupSubmit`', () => {
    const wrapper = setup();

    const handleSignupSubmitSpy = jest.spyOn(
      wrapper.instance(),
      'handleSignupSubmit'
    );
    wrapper.instance().handleSignupSubmit();
    expect(handleSignupSubmitSpy).toHaveBeenCalled();
  });

  it('should call `disableSignupButton`', () => {
    const wrapper = setup();

    const disableSignupButtonSpy = jest.spyOn(
      wrapper.instance(),
      'disableSignupButton'
    );
    wrapper.instance().disableSignupButton();
    expect(disableSignupButtonSpy).toHaveBeenCalled();
  });

  it('should call `enableSignupButton`', () => {
    const wrapper = setup();

    const enableSignupButtonSpy = jest.spyOn(
      wrapper.instance(),
      'enableSignupButton'
    );
    wrapper.instance().enableSignupButton();
    expect(enableSignupButtonSpy).toHaveBeenCalled();
  });

  it('should map state to props', () => {
    const initialState = {
      loginReducer: {
        authenticated: true,
      },
      signupReducer: {
        signupError: ''
      },
    };

    const tree = mapStateToProps(initialState);
    expect(tree).toMatchSnapshot();
  });
});

