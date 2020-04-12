import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import history from './history';
import PrivateRoute from './components/container/PrivateRoute';
import requireCaterer from './components/container/requireCaterer';
import requireUser from './components/container/requireUser';
import ConnectedMealManager
  from './components/mealManager/ConnectedMealManager';
import ConnectedSignUp from './components/signup/ConnectedSignUp';
import ConnectedLogin from './components/login/ConnectedLogin';
import ConnectedMenu from './components/menu/ConnectedMenu';
import ConnectedOrder from './components/orders/ConnectedOrder';
import ConnectedDashboard from './components/dashboard/ConnectedDashboard';
import NotFound from './components/helpers/NotFound';
import '../public/styles/common.scss';


const MealManagerWithAuthorization = requireCaterer(ConnectedMealManager);
const MenuWithAuthorization = requireCaterer(ConnectedMenu);
const DashboardWithAuthorization = requireCaterer(ConnectedDashboard);
const OrderWithAuthorization = requireUser(ConnectedOrder);
const AppRoutes = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <PrivateRoute
        exact
        path="/"
        caterer={ConnectedMealManager}
        customer={ConnectedOrder}
      />
      <Route exact path="/login" component={ConnectedLogin} />
      <Route exact path="/signup" component={ConnectedSignUp} />
      <Route path="/meals" component={MealManagerWithAuthorization} />
      <Route path="/menu" component={MenuWithAuthorization} />
      <Route path="/orders" component={OrderWithAuthorization} />
      <Route path="/dashboard" component={DashboardWithAuthorization} />
      <Route path="/*" component={NotFound} />
    </Switch>
  </ConnectedRouter>
);

export default connect(state => state)(hot(module)(AppRoutes));
