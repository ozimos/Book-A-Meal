import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { userActions } from '../../redux/actions';
import MyInput from '../helpers/MyInput';
import MyCheckBox from '../helpers/MyCheckBox';
import '../../../public/styles/auth.scss';


class SignUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      newError: false,
      prevSignupError: {}
    };
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.serverFeedback = this.serverFeedback.bind(this);
    this.formEl = null;
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
  componentDidUpdate() {
    const { prevSignupError, newError } = this.state;

    if (newError && Object.keys(prevSignupError).length !== 0) {
      this.serverFeedback(prevSignupError);
      // eslint-disable-next-line
      this.setState({ newError: false });
    }
  }
  handleSubmit(user) {
    this.setState({ prevSignupError: {} });
    this.props.dispatch(userActions.logout(user));
    this.props.dispatch(userActions.signUp(user));
  }
  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }
  serverFeedback(error) {
    this.formEl.updateInputsWithError(error);
  }


  render() {
    return (
      <div className="canvas">
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
                onValidSubmit={this.handleSubmit}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
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
                <MyCheckBox
                  name="isCaterer"
                />
                <div>
                  <label htmlFor="isCaterer">
                    <MyCheckBox
                      name="isCaterer"
                      id="isCaterer"
                    />
                    <span>Caterer</span>
                  </label>
                </div>

                <button
                  className={this.state.canSubmit ? 'btn' : 'btn btn-disabled'}
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
};
const mapStateToProps = state => ({
  signupError: state.signupReducer.signupError
});
export { SignUp };
export default connect(mapStateToProps)(SignUp);
