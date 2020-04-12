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

    const propsAuthenticated = {
      dispatch: jest.fn(),
      authenticated: true
    };
    const propsSignUpError = {
      dispatch: jest.fn(),
      signupError: { password: 'wrong password' }
    };
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
    const wrapperAuthenticated = shallow(<SignUp {...propsAuthenticated} />);
    expect(toJson(wrapperAuthenticated)).toMatchSnapshot();
    const wrapperSignUpError = shallow(<SignUp {...propsSignUpError} />);
    expect(toJson(wrapperSignUpError)).toMatchSnapshot();
  });

  it('should call `componentDidUpdate` on signup error', () => {
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

  it('should call `handleSignupSubmit` on signup form submit', () => {
    const wrapper = setup();

    const handleSignupSubmitSpy = jest.spyOn(
      wrapper.instance(),
      'handleSignupSubmit'
    );
    wrapper.instance().handleSignupSubmit();
    expect(handleSignupSubmitSpy).toHaveBeenCalled();
  });

  it(
    'should call `disableSignupButton` on incorrect signup form input ',
    () => {
      const wrapper = setup();

      const disableSignupButtonSpy = jest.spyOn(
        wrapper.instance(),
        'disableSignupButton'
      );
      wrapper.instance().disableSignupButton();
      expect(disableSignupButtonSpy).toHaveBeenCalled();
    }
  );

  it('should call `enableSignupButton` on correct signup form input', () => {
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

