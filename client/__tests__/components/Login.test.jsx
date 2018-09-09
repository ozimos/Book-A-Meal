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
    const props2 = {
      dispatch: jest.fn(),
      authenticated: true
    };
    const props3 = {
      dispatch: jest.fn(),
      loginError: { password: 'wrong password' }
    };
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();

    const wrapper2 = shallow(<Login {...props2} />);
    expect(toJson(wrapper2)).toMatchSnapshot();

    const wrapper3 = shallow(<Login {...props3} />);
    expect(toJson(wrapper3)).toMatchSnapshot();
  });

  it('should call `componentDidUpdate`', () => {
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

  it('should call `handleLoginSubmit`', () => {
    const wrapper = setup();

    const handleLoginSubmitSpy = jest.spyOn(
      wrapper.instance(),
      'handleLoginSubmit'
    );
    wrapper.instance().handleLoginSubmit();
    expect(handleLoginSubmitSpy).toHaveBeenCalled();
  });

  it('should call `disableLoginButton`', () => {
    const wrapper = setup();

    const disableLoginButtonSpy = jest.spyOn(
      wrapper.instance(),
      'disableLoginButton'
    );
    wrapper.instance().disableLoginButton();
    expect(disableLoginButtonSpy).toHaveBeenCalled();
  });

  it('should call `enableLoginButton`', () => {
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

