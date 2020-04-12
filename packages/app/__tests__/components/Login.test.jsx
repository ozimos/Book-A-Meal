/* global React:false, shallow:false toJson:false */

import { Login, mapStateToProps }
  from '../../src/components/login/ConnectedLogin';

const props = {
  dispatch: jest.fn(),
  authenticated: false,
};
describe('Login Component', () => {
  const setup = () => shallow(<Login {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect((wrapper)
      .exists(<form className="form" />)).toBe(true);
  });

  it('renders correctly', () => {
    const propsWithAuthentication = {
      dispatch: jest.fn(),
      authenticated: true
    };
    const propsWrongPassword = {
      dispatch: jest.fn(),
      loginError: { password: 'wrong password' }
    };
    let wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = shallow(<Login {...propsWithAuthentication} />);
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = shallow(<Login {...propsWrongPassword} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `componentDidUpdate` on login error', () => {
    const serverFeedbackSpy = jest.spyOn(
      Login.prototype,
      'serverFeedback'
    );
    const componentDidUpdateSpy = jest.spyOn(
      Login.prototype,
      'componentDidUpdate'
    );
    serverFeedbackSpy.mockImplementation(() => jest.fn());
    const wrapper = setup();
    wrapper.setState({ prevSignupError: { password: 'wrong password' },
      newError: true });
    wrapper.instance().componentDidUpdate();
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  it('should call `handleLoginSubmit` on login form submit', () => {
    const wrapper = setup();

    const handleLoginSubmitSpy = jest.spyOn(
      wrapper.instance(),
      'handleLoginSubmit'
    );
    wrapper.instance().handleLoginSubmit();
    expect(handleLoginSubmitSpy).toHaveBeenCalled();
  });

  it('should call `disableLoginButton` on incorrect login form input ', () => {
    const wrapper = setup();

    const disableLoginButtonSpy = jest.spyOn(
      wrapper.instance(),
      'disableLoginButton'
    );
    wrapper.instance().disableLoginButton();
    expect(disableLoginButtonSpy).toHaveBeenCalled();
  });

  it('should call `enableLoginButton` on correct login form input', () => {
    const wrapper = setup();

    const enableLoginButtonSpy = jest.spyOn(
      wrapper.instance(),
      'enableLoginButton'
    );
    wrapper.instance().enableLoginButton();
    expect(enableLoginButtonSpy).toHaveBeenCalled();
  });

  it('should map state to props', () => {
    const initialState = {
      loginReducer: {
        authenticated: false,
        loginError: ''
      }
    };

    const tree = mapStateToProps(initialState);
    expect(tree).toMatchSnapshot();
  });
});

