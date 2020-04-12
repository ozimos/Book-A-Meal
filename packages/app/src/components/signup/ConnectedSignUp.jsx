import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { userActions } from '../../redux/actions';
import MyInput from '../helpers/MyInput';
import MyCheckBox from '../helpers/MyCheckBox';
import '../../../public/styles/auth.scss';


export class SignUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      newError: false,
      prevSignupError: {}
    };
    this.disableSignupButton = this.disableSignupButton.bind(this);
    this.enableSignupButton = this.enableSignupButton.bind(this);
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    this.serverFeedback = this.serverFeedback.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.signupError
      && !isEqual(nextProps.signupError, prevState.prevSignupError)) {
      return {
        prevSignupError: nextProps.signupError,
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
    const { prevSignupError, newError } = this.state;

    if (newError && Object.keys(prevSignupError).length) {
      this.serverFeedback(prevSignupError);
      // eslint-disable-next-line
      this.setState({ newError: false });
    }
  }

  handleSignupSubmit(user) {
    this.setState({ prevSignupError: {} });
    this.props.dispatch(userActions.logout(user));
    this.props.dispatch(userActions.signUp(user));
  }

  disableSignupButton() {
    this.setState({ canSubmit: false });
  }

  enableSignupButton() {
    this.setState({ canSubmit: true });
  }

  serverFeedback(error) {
    this.formEl.updateInputsWithError(error);
  }


  render() {
    return (
      <div className="canvas signup">
        <div className="container2 container2-height">
          <header className="header">
            <h2 className="heading">Book A Meal</h2>
          </header>
          <main>
            <div className="welcome">
              <h4 className="welcome-text">
                Welcome!
              </h4>
              <h5>
                Register by entering the information below
              </h5>
            </div>
            <div className="form-box">
              <Formsy
                className="form"
                onValidSubmit={this.handleSignupSubmit}
                onValid={this.enableSignupButton}
                onInvalid={this.disableSignupButton}
                ref={(form) => { this.formEl = form; }}
              >

                <MyInput
                  typeOfInput="email"
                  name="email"
                  required
                  placeholder="Email"
                  validations={{ isEmail: true, minLength: 5, maxLength: 48 }}
                  validationError="This is not a valid email"
                  validationErrors={{
                    minLength: 'input must be longer than 5 character',
                    maxLength: 'input must be shorter than 50 characters',
                    isEmail: 'This is not a valid email'
                  }}
                />
                <div className="invalid-feedback" />

                <MyInput
                  typeOfInput="text"
                  name="firstName"
                  placeholder="First Name"
                  validations={{ minLength: 1, maxLength: 48 }}
                  validationError="Please enter your first name"
                  validationErrors={{
                    minLength: 'input must be longer than 1 character',
                    maxLength: 'input must be shorter than 50 characters',
                  }}
                  required
                />
                <div className="invalid-feedback" />

                <MyInput
                  typeOfInput="text"
                  name="lastName"
                  placeholder="Last Name"
                  validations={{ minLength: 1, maxLength: 48 }}
                  validationError="Please enter your last name"
                  validationErrors={{
                    minLength: 'input must be longer than 1 character',
                    maxLength: 'input must be shorter than 50 characters',
                  }}
                  required
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

                <MyInput
                  typeOfInput="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  validations={{
                    equalsField: 'password',
                    minLength: 8,
                    maxLength: 48
                  }}
                  validationError="Passwords do not match"
                  validationErrors={{
                    equalsField: 'Passwords do not match',
                    minLength: 'Must have at least 8 characters',
                    maxLength: 'input must be shorter than 50 characters',
                  }}
                />

                <label htmlFor="isCaterer">
                  <MyCheckBox
                    name="isCaterer"
                    id="isCaterer"
                  />
                  <span>Caterer</span>
                </label>

                <button
                  className={this.state.canSubmit ? 'btn' : 'btn btn-disabled'}
                  id="signup-button"
                  type="submit"
                  disabled={!this.state.canSubmit}
                >
                  Continue
                </button>
              </Formsy>

              <div className="stacked-text">
                <Link
                  to="/login"
                >
                  <p>Already have an account? Click here to sign in</p>
                </Link>
              </div>
            </div>
          </main>

        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  dispatch: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired
};

export const mapStateToProps = state => ({
  authenticated: state.loginReducer.authenticated,
  signupError: state.signupReducer.signupError
});


export default connect(mapStateToProps)(SignUp);
