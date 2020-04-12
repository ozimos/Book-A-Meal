import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validateToken from '../../services/validateToken';

const PrivateRoute = ({ caterer: Caterer, customer: Customer, ...rest }) => {
  const token = JSON.parse(localStorage.getItem('token'));

  let result = {};
  if (token) {
    result = validateToken(token);
  }
  return (
    <Route
      {...rest}
      render={(props) => {

      if (result.valid && result.isCaterer) {
        return (<Caterer {...props} />);
      } else if (result.valid && !result.isCaterer) {
        return (<Customer {...props} />);
      } return (<Redirect to="/login" />);

    }}
    />
  );
};
PrivateRoute.defaultProps = {
  caterer: null,
  customer: null,
};
PrivateRoute.propTypes = {
  caterer: PropTypes.func,
  customer: PropTypes.func,
};
export default PrivateRoute;
