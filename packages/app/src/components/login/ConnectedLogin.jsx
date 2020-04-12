import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import isEqual from 'lodash.isequal';
import MyInput from '../helpers/MyInput';
import { userActions } from '../../redux/actions';
import '../../../public/styles/auth.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      newError: false,
      prevLoginError: {}
    };

    this.disableLoginButton = this.disableLoginButton.bind(this);
    this.enableLoginButton = this.enableLoginButton.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.serverFeedback = this.serverFeedback.bind(this);
    this.formEl = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.loginError &&
      !isEqual(nextProps.loginError, prevState.prevLoginError)) {
      return {
        prevLoginError: nextProps.loginError,
        newError: true
      };
    }
    return null;
  }

  componentDidMount() {
    if (this.props.authenticated) {
      this.props.dispatch(push('/'));
    }
  }

  componentDidUpdate() {
    const { prevLoginError, newError } = this.state;

    if (newError && Object.keys(prevLoginError).length) {
      this.serverFeedback(prevLoginError);
      // eslint-disable-next-line
      this.setState({ newError: false });
    }
  }

  handleLoginSubmit(user) {
    this.setState({ prevLoginError: {} });
    this.props.dispatch(userActions.logout(user));
    this.props.dispatch(userActions.login(user));
  }

  disableLoginButton() {
    this.setState({ canSubmit: false });
  }

  enableLoginButton() {
    this.setState({ canSubmit: true });
  }

  serverFeedback(error) {
    this.formEl.updateInputsWithError(error);
  }

  render() {

    return (
      <div className="canvas">
        <div className="container2">

          <header className="header">
            <h2 className="heading">Book A Meal</h2>
          </header>

          <main>

            <div className="welcome">
              <h4 className="welcome-text">
                Welcome!
              </h4>
              <h5>
                Sign in by entering the information below
              </h5>
            </div>

            <div className="form-box">

              <Formsy
                className="form"
                onValidSubmit={this.handleLoginSubmit}
                onValid={this.enableLoginButton}
                onInvalid={this.disableLoginButton}
                ref={(form) => { this.formEl = form; }}
              >
                <MyInput
                  typeOfInput="email"
                  name="email"
                  placeholder="Email"
                  validations={{ isEmail: true, minLength: 5, maxLength: 48 }}
                  validationError="This is not a valid email"
                  validationErrors={{
                    minLength: 'input must be longer than 5 character',
                    maxLength: 'input must be shorter than 50 characters',
                    isEmail: 'This is not a valid email'
                  }}
                />

                <MyInput
                  typeOfInput="password"
                  name="password"
                  placeholder="Password"
                  required
                  validations={{
                    hasUpperCase: (values, value) =>
                    /[A-Z]+|.{16,}/.test(value),
                    hasLowerCase: (values, value) =>
                    /[a-z]+|.{16,}/.test(value),
                    hasNumber: (values, value) =>
                    /\d+|.{16,}/.test(value),
                    hasSpecialCharacter: (values, value) =>
                    /\W+|.{16,}/.test(value),
                    minLength: 8,
                    maxLength: 48
                  }}
                  validationErrors={{
                    hasUpperCase: `Must have uppercase letter or you can 
                    use a passphrase of minimum length 16 characters`,
                    hasLowerCase: `Must have lowercase letter or you can
                     use a passphrase of minimum length 16 characters`,
                    hasNumber: `Must have a number or you can
                     use a passphrase of minimum length 16 characters`,
                    hasSpecialCharacter: `Must have a special character or 
                    you can use a passphrase of minimum length 16 characters`,
                    minLength: 'Must have at least 8 characters',
                    maxLength: 'input must be shorter than 50 characters',
                  }}
                />

                <button
                  className={this.state.canSubmit ?
                     'btn login' : 'btn login btn-disabled'}
                  type="submit"
                  disabled={!this.state.canSubmit}
                >
                  Continue
                </button>
              </Formsy>

              <div className="stacked-text">

                <Link to="/signup">
                  <p id="signup">
                    Don&#39;t have an account?
                     Click here to create one
                  </p>
                </Link>

              </div>

            </div>
          </main>

        </div>
      </div>
    );
  }
}

Login.defaultProps = {
  authenticated: false
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  authenticated: PropTypes.bool
};

export const mapStateToProps = state => ({
  authenticated: state.loginReducer.authenticated,
  loginError: state.loginReducer.loginError
});

export { Login };

export default connect(mapStateToProps)(Login);
