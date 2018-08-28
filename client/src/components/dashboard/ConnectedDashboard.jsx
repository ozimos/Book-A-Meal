import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import format from 'date-fns/format';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';
import SearchInput, { createFilter } from 'react-search-input';
import Greeting from '../greeting/Greeting';
import { dashboardActions } from '../../redux/actions';
import ConnectedNav from '../nav/ConnectedNav';
import uniqueUsers from '../../utils/uniqueUsers';
import cashTotal, { subTotal } from '../../utils/cashTotal';
import orderDetails from '../../utils/orderDetails';
import '../../../public/styles/dashboard.scss';

ReactModal.setAppElement(document.getElementById('root'));

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };
    this.searchUpdated = this.searchUpdated.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(dashboardActions.getOrdersWithMealLinksByDate());
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  render() {
    const KEYS_TO_FILTERS = [
      'id', 'User.firstName', 'User.lastName', 'User.email', 'updatedAt'];
    const isTodayOrder = this.props.orders.length !== 0;
    let filteredOrders;
    if (isTodayOrder) {
      filteredOrders = this.props.orders
        .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    }
    const { isCaterer, firstName } = this.props.user;
    return (
      <div id="dashboard" className="canvas2">
        <div className="container3">

          <header className="header extra">
            <ConnectedNav />
          </header>
          <main>
            <Greeting isCaterer={isCaterer} firstName={firstName} />

            <div className="flexbox">
              <div className="card order_summary">
                <div className="flexbox">
                  <span
                    className="order_span summary_value flow-text"
                  >{this.props.orders.length}
                  </span>
                  <span
                    className="order_span shrink"
                  >
                    <img
                      alt="cutlery"
                      className="responsive-img"
                      src="./images/food.png"
                    />
                  </span>
                </div>
                <h5 className="flow-text" >Orders</h5>
              </div >
              <div className="card order_summary">
                <div className="flexbox">
                  <span
                    className="order_span summary_value flow-text"
                  >{uniqueUsers(this.props.orders)}
                  </span>
                  <span
                    className="order_span shrink"
                  >
                    <img
                      alt="head profile"
                      className="responsive-img"
                      src="./images/profile.png"
                    />
                  </span>
                </div>
                <h5 className="flow-text">Customer(s)</h5>
              </div >
              <div className="card order_summary">
                <div className="flexbox">
                  <span
                    className="order_span summary_value flow-text"
                  >
                  &#8358;{cashTotal(this.props.orders)}
                  </span>
                  <span
                    className="order_span shrink"
                  >
                    <img
                      alt="upward stock chart"
                      className="responsive-img"
                      src="./images/chart.png"
                    />
                  </span>
                </div>
                <h5 className="flow-text">Total Sales</h5>
              </div>
            </div>
            <div className="order_detail flexbox title-element">
              <h5>
                Today&#39;s Orders
              </h5>
              <SearchInput
                className="search-input input-field"
                onChange={this.searchUpdated}
              />
            </div>
            <Accordion accordion={false}>
              <AccordionItem expanded>
                <AccordionItemTitle />
                <AccordionItemBody>
                  <div>
                    { isTodayOrder ?
                      <table className="striped responsive-table">
                        <thead>
                          <tr>
                            <th>S/N</th>
                            <th>Customer</th>
                            <th>Order</th>
                            <th>Meals</th>
                            <th>Quantities</th>
                            <th>Time</th>
                            <th>Total(&#8358;)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders && filteredOrders
                          .map((order, index) => (
                            <tr key={order.id}>
                              <td>{index + 1}</td>
                              <td>
                                {`${order.User.firstName} 
                                ${order.User.lastName}`}
                              </td>
                              <td>{order.id}</td>
                              <td>{orderDetails.mealTitleList(order)}</td>
                              <td>{orderDetails.mealQuantityList(order)}</td>
                              <td>{format(order.updatedAt, 'h:mm A')}</td>
                              <td>{subTotal(order.Meals)}</td>
                            </tr>
                        ))
                      }
                        </tbody>
                      </table> :
                      <div>No orders have been placed today</div>
                  }
                  </div>
                </AccordionItemBody>
              </AccordionItem>
            </Accordion>
          </main>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
    firstName: PropTypes.string
  }).isRequired,
};
const mapStateToProps = state => ({
  user: state.loginReducer.user.data,
  meals: state.mealsReducer.meals,
  orders: state.dashboardReducer.orders,
  authenticated: state.loginReducer.authenticated,
});
export { Dashboard };
export default connect(mapStateToProps)(Dashboard);
