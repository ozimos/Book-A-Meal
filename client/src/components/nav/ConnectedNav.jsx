import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { userActions } from '../../redux/actions';
import '../../../public/styles/nav.scss';

class Nav extends React.Component {

   logoutHandler = () => {
     this.props.dispatch(userActions.logout());
     this.props.dispatch(push('/login'));
   }

   render() {
     const { user, authenticated } = this.props;

     return (
       <div className="navbar-fixed">
         <nav className="flexbox">

           <h3 className="shrink heading">
             <Link to="/">
        Book A Meal
             </Link>
           </h3>

           <div className="flexbox">

             {user.isCaterer &&
             <NavLink
               activeClassName="active"
               className="nav-item long_string"
               to="/dashboard"
             >
        DashBoard
             </NavLink >}

             {user.isCaterer &&
             <NavLink
               activeClassName="active"
               className="nav-item"
               to="/meals"
             >
          Meals
             </NavLink >}

             {user.isCaterer &&
             <NavLink
               activeClassName="active"
               className="nav-item"
               to="/menu"
             >
          Menu
             </NavLink>}

             {!user.isCaterer &&
             <NavLink
               activeClassName="active"
               className="nav-item"
               to="/orders"
             >
          Meal Booking
             </NavLink>}

             {authenticated &&
             <button
               onClick={this.logoutHandler}
             >
          Log Out
             </button>}

             {!authenticated &&
             <Link to="/login">
          Log In
             </Link>}

           </div>
         </nav>
       </div>
     );

   }
}

Nav.defaultProps = {
  user: { isCaterer: false }
};

Nav.propTypes = {
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
  }),
  authenticated: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.loginReducer.user,
  authenticated: state.loginReducer.authenticated,
});

export { Nav };

export default connect(mapStateToProps)(Nav);
