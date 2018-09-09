import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';
import SearchInput, { createFilter } from 'react-search-input';
import DashboardTableContainer from '../mealCard/DashboardTableContainer';
import MealsTable from '../mealCard/MealsTable';

import Greeting from '../greeting/Greeting';
import { dashboardActions } from '../../redux/actions';
import ConnectedNav from '../nav/ConnectedNav';
import '../../../public/styles/dashboard.scss';

ReactModal.setAppElement(document.getElementById('root'));

export class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      selectedOrderId: '',
      showMealDetailModal: false,
    };
    this.searchUpdated = this.searchUpdated.bind(this);
  }

  componentDidMount() {
    const { offset = 0, limit = 10 } = this.props.pagination;
    this.props
      .dispatch(dashboardActions.getOrdersWithMealLinks({ limit, offset }));
    this.props.dispatch(dashboardActions.getDaysOrdersTotal());
  }

  onFetchMealData = (state) => {
    const id = this.state.selectedOrderId || this.props.orders[0].id;
    const { page, pageSize } = state;
    const offset = pageSize * page;
    return this.props.dispatch(dashboardActions
      .getMealsInOrder(id, { limit: pageSize, offset }));
  }

  onFetchOrderData = (state) => {
    const { page, pageSize } = state;
    const offset = pageSize * page;
    return this.props.dispatch(dashboardActions
      .getOrdersWithMealLinks({ limit: pageSize, offset }));
  }

  getOrderMealsTotals = id =>
    this.props.dispatch(dashboardActions.getOrderTotal(id))

  getOrderMeals = (id) => {
    const { offset = 0, limit = 5 } = this.props.mealsPagination;
    this.setState({ showMealDetailModal: true, selectedOrderId: id });
    this.props
      .dispatch(dashboardActions.getMealsInOrder(id, { limit, offset }));
  }

  closeMealDetailModal = () => this.setState({ showMealDetailModal: false });

  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  render() {

    const KEYS_TO_FILTERS = [
      'id', 'User.firstName', 'User.lastName', 'User.email', 'updatedAt'];
    const isTodayOrder = Boolean(this.props.orders.length);
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
                  >{this.props.daysTotal.orders}
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
                  >{this.props.daysTotal.users}
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
                  &#8358;{this.props.daysTotal.revenue}
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
              Order History
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

                  <div />

                  { isTodayOrder ?
                    <DashboardTableContainer
                      orders={filteredOrders}
                      loading={this.props.orderConnecting}
                      pagination={this.props.pagination}
                      addOrderToCart={this.addOrderToCart}
                      onFetchData={this.onFetchOrderData}
                      getOrderMeals={this.getOrderMeals}
                      getOrderMealsTotals={this.getOrderMealsTotals}
                      defaultPage={this.state.currentPage}
                      currentOrderId={this.state.currentOrderId}
                    /> :
                    <div>
                  You have not placed an order today
                    </div>
                }
                </AccordionItemBody>

              </AccordionItem>

            </Accordion>
          </main>

          <ReactModal
            isOpen={this.state.showMealDetailModal}
            contentLabel="Input Modal"
            className="modal-content"
            onRequestClose={this.closeMealDetailModal}
            shouldCloseOnOverlayClick
            style={{ content: { width: '60%' } }}
          >

            <MealsTable
              meals={this.props.orderMeals}
              total={this.props.total}
              mealsPagination={this.props.mealsPagination}
              loading={this.props.loadingMeals}
              onFetchData={this.onFetchMealData}
              closeMealDetailModal={this.closeMealDetailModal}
              getTrProps={() => ({ style: { cursor: 'pointer' } })}
            />

          </ReactModal>

        </div>
      </div>
    );
  }
}

Dashboard.defaultProps = {
  orders: [],
  orderMeals: [],
  orderConnecting: false,
  loadingMeals: false,
  total: 0,
  daysTotal: {},
  pagination: {
    pages: 1,
    limit: 10,
    offset: 0
  },
  mealsPagination: {
    pages: 1,
    limit: 5,
    offset: 0
  },
};

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object),
  orderMeals: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.shape({
    pages: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number
  }),
  mealsPagination: PropTypes.shape({
    pages: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number
  }),
  orderConnecting: PropTypes.bool,
  loadingMeals: PropTypes.bool,
  total: PropTypes.number,
  daysTotal: PropTypes.shape({
    revenue: PropTypes.number,
    users: PropTypes.number,
    orders: PropTypes.number
  }),
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
    firstName: PropTypes.string
  }).isRequired,
};

export const mapStateToProps = state => ({
  user: state.loginReducer.user,
  meals: state.mealsReducer.meals,
  orders: state.dashboardReducer.orders,
  orderMeals: state.dashboardReducer.orderMeals,
  authenticated: state.loginReducer.authenticated,
  orderError: state.dashboardReducer.orderError,
  orderMealsError: state.dashboardReducer.orderMealsError,
  loadingMeals: state.dashboardReducer.loadingMeals,
  total: state.dashboardReducer.total,
  daysTotal: state.dashboardReducer.daysTotal,
  pagination: state.dashboardReducer.pagination,
  mealsPagination: state.dashboardReducer.mealsPagination,
  orderConnecting: state.dashboardReducer.connecting,
});


export default connect(mapStateToProps)(Dashboard);
