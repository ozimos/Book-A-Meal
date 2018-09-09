import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const AuthenticatedComponent = (props) => {
  const {
    MyComponent,
    authenticated,
    user,
    ...rest
  } = props;

  return (
    <Fragment>
      { authenticated
        && user.isCaterer && <MyComponent {...rest} />}
      { authenticated && !user.isCaterer
        && <h1>This page is for Caterers</h1>}
      { !authenticated && <Redirect to="/login" />}
    </Fragment>
  );
};

AuthenticatedComponent.defaultProps = {
  authenticated: false,
  user: {}
};

AuthenticatedComponent.propTypes = {
  authenticated: PropTypes.bool,
  MyComponent: PropTypes.func.isRequired,
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
  })
};

const requireCaterer = (MyComponent) => {
  const mapStateToProps = state => ({
    authenticated: state.loginReducer.authenticated,
    user: state.loginReducer.user,
    MyComponent
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
};

export default requireCaterer;
