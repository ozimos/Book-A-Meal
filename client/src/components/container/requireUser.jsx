import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const AuthenticatedComponent = (props) => {

  const {
    MyComponent,
    authenticated,
    ...rest
  } = props;

  return (
    <Fragment>
      { authenticated && <MyComponent {...rest} />}
      { !authenticated && <Redirect to="/login" />}
    </Fragment>
  );
};

AuthenticatedComponent.defaultProps = {
  authenticated: false,
};

AuthenticatedComponent.propTypes = {
  authenticated: PropTypes.bool,
  MyComponent: PropTypes.func.isRequired,
};

const requireUser = (MyComponent) => {
  const mapStateToProps = state => ({
    authenticated: state.loginReducer.authenticated,
    user: state.loginReducer.user,
    MyComponent
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
};

export default requireUser;
