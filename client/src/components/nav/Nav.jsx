import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../../public/styles/book_a_meal.css';

const Nav = ({ user }) =>
  (
    <nav className="flexbox">
      <h2 className="shrink heading">Book A Meal</h2>
      <div className="flexbox nowrap">
        {user.isCaterer &&
        <NavLink activeClassName="active" className="nav-item" to="/menu">
          Menu
        </NavLink>}
        {user.isCaterer &&
        <NavLink activeClassName="active" className="nav-item" to="/meals">
          Meals
        </NavLink >}
        {user.isCaterer &&
        <NavLink activeClassName="active" className="nav-item" to="/dashboard">
        DashBoard
        </NavLink >}
        <NavLink activeClassName="active" className="nav-item" to="/orders">
          Meal Booking
        </NavLink>
        <Link to="/login">
          Log Out
        </Link>
      </div>
    </nav>);
Nav.propTypes = {
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
  }).isRequired,
};
const mapStateToProps = state => ({
  user: state.loginReducer.user.data,
  authenticated: state.loginReducer.authenticated,
});
export { Nav };
export default connect(mapStateToProps)(hot(module)(Nav));
