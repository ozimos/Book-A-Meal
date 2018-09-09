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
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import 'react-toastify/dist/ReactToastify.css';
import MealDisplayCard from '../mealCard/MealDisplayCard';
import MealRow from '../orderCart/MealRow';
import ConnectedCartContainer from '../orderCart/ConnectedCartContainer';
import MealCardContainer from '../mealCard/MealCardContainer';
import OrderTableContainer from '../mealCard/OrderTableContainer';
import MealsTable from '../mealCard/MealsTable';
import Greeting from '../greeting/Greeting';
import { menuActions, orderActions } from '../../redux/actions';
import ConnectedNav from '../nav/ConnectedNav';
import '../../../public/styles/bookameal.scss';
import '../../../public/styles/search-input.css';
import '../../../public/styles/accordion.css';

ReactModal.setAppElement(document.getElementById('root'));
export class Order extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      currentOrder: [],
      currentOrderId: '',
      selectedOrderId: '',
      showOrderModal: false,
      showMealDetailModal: false,
      currentPage: 0,
      addOrder: false
    };
  }

  componentDidMount() {
    const { offset = 0, limit = 10 } = this.props.pagination;
    this.props.dispatch(menuActions.getMenu());
    this.props.dispatch(orderActions.getOrdersWithMealLinks({ limit, offset }));
  }

  componentDidUpdate() {
    if (Object.keys(this.props.orderEditMeals).length && this.state.addOrder) {
      const order = this.props.orderEditMeals;

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        currentOrder: order.Meals,
        currentOrderId: order.id,
        addOrder: false
      });
      toast(
        'Meal has been added to cart for editing',
        { className: 'toaster' }
      );
    }
  }

  onFetchMealData = (state) => {
    const id = this.state.selectedOrderId || this.props.orders[0].id;
    const { page, pageSize } = state;
    const offset = pageSize * page;
    return this.props.dispatch(orderActions
      .getMealsInOrder(id, { limit: pageSize, offset }));
  }

   onFetchOrderData = (state) => {
     const { page, pageSize } = state;
     const offset = pageSize * page;
     this.props.dispatch(orderActions
       .getOrdersWithMealLinks({ limit: pageSize, offset }));
   }
  getOrderMealsTotals = id =>
    this.props.dispatch(orderActions.getOrderTotal(id))

  getOrderMeals = (id) => {
    const { offset = 0, limit = 5 } = this.props.mealsPagination;
    this.setState({ showMealDetailModal: true, selectedOrderId: id });
    this.props.dispatch(orderActions.getMealsInOrder(id, { limit, offset }));
  }

  handleMenuPaginationClick = (pages) => {
    const { limit } = this.props.menuPagination;
    const nextOffset = (pages.selected) * limit;
    this.props.dispatch(menuActions.getMenu({ limit, offset: nextOffset }));
  }

  openCartModal = () => this.setState({ showOrderModal: true })

  closeCartModal = () => this.setState({ showOrderModal: false })

  closeMealDetailModal = () => this.setState({ showMealDetailModal: false });

  notify = message => toast(message, { className: 'toaster' });

  addMealToCart = (meal) => {
    const inOrder = this.state.currentOrder.some(elem => elem.id === meal.id);
    if (!inOrder) {
      this.setState(prevState =>
        ({ currentOrder: [...prevState.currentOrder, meal] }));
      toast('Meal has been added to cart', { className: 'toaster' });
    } else {
      toast('Meal is already in cart', { className: 'toaster' });
    }
  }

  addOrderToCart = (id) => {
    this.props.dispatch(orderActions.getOrderForUpdate(id));
    this.setState({ addOrder: true });
  }

  removeMealFromCart = (id) => {
    if (this.state.currentOrder.length <= 1) {
      toast.error(
        `There must be at least one meal in the cart. 
        Use the clear cart button to clear cart`,
        { className: 'toaster' }
      );
    } else {
      this.setState(prevState =>
        ({ currentOrder: prevState
          .currentOrder.filter(elem => elem.id !== id) }));
    }
  }

  clearOrder = () => {
    this.setState({ currentOrder: [], currentOrderId: '' });
    this.closeCartModal();
  }

  searchUpdated = (term) => {
    this.setState({ searchTerm: term });
  }

  postOrder = () => {
    const orderIdArray = this.state.currentOrder.map(meal => meal.id);
    this.props.dispatch(orderActions.postOrder({ currentOrder: orderIdArray }));
  }

  render() {
    const KEYS_TO_FILTERS = ['id', 'title', 'description', 'price'];


    const isMenuSet = this.props.menu.length !== 0;
    const isMealSelected = this.state.currentOrder
    && this.state.currentOrder.length;
    const isTodayOrder = this.props.orders.length !== 0;
    let filteredMeals;
    if (isMenuSet) {
      filteredMeals = this.props.menu.length ? this.props.menu
        .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)) : [];
    }
    const { isCaterer, firstName } = this.props.user;
    const menuPages = this.props.menuPagination.pages;


    return (
      <div className="contain">
        <header className="header">
          <ConnectedNav />
        </header>
        <div className="flexbox">

          <Greeting isCaterer={isCaterer} firstName={firstName} />
          <button
            className="btn title-button"
            onClick={this.openCartModal}
            disabled={!isMealSelected}
          >
            <p
              className="cart-notification"
            >
                      Cart
              <span className="badge">
                {this.state.currentOrder.length}
              </span>
            </p>
          </button>
        </div>
        <div className="row">
          <main className="col s12">
            <ToastContainer autoClose={2000} />
            <Accordion accordion>

              <AccordionItem expanded>
                <AccordionItemTitle>
                  <div className="title-element flexbox">
                    <h4 className="long_string">
                  Today&#39;s Menu
                    </h4>
                    <div
                      className="accordion__arrow u-position-relative"
                      role="presentation"
                    />
                  </div>
                </AccordionItemTitle>

                <AccordionItemBody>
                  <div className="flexbox">
                    <SearchInput
                      className="search-input input-field"
                      onChange={this.searchUpdated}
                    />

                  </div>
                  {isMenuSet ?
                    <div>
                      <MealCardContainer
                        meals={filteredMeals}
                        MealCard={MealDisplayCard}
                        addToCollection={this.addMealToCart}
                        collection="cart"
                        addClass="scroll"
                      />
                      <ReactPaginate
                        previousLabel="previous"
                        nextLabel="next"
                        pageCount={menuPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handleMenuPaginationClick}
                        containerClassName="pagination"
                        subContainerClassName="pages pagination"
                        activeClassName="active"
                      />
                    </div>
                  :
                    <div>
                  The menu for the day has not been set
                    </div>
                }
                </AccordionItemBody>

              </AccordionItem>

              <AccordionItem>
                <AccordionItemTitle>
                  <div className="title-element flexbox">
                    <h4 className="long_string">
                      Your Order History
                    </h4>
                    <div
                      className="accordion__arrow u-position-relative"
                      role="presentation"
                    />
                  </div>
                </AccordionItemTitle>

                <AccordionItemBody>
                  <p className="mr-auto">
                    {`Orders can only be edited up to 
                    ${process.env.ORDER_EDIT_MINUTES || 15}
                     minutes after order is placed`}
                  </p>
                  { isTodayOrder ? <OrderTableContainer
                    orders={this.props.orders}
                    loading={this.props.orderConnecting}
                    loadingMeals={this.props.loadingMeals}
                    pagination={this.props.pagination}
                    addOrderToCart={this.addOrderToCart}
                    onFetchData={this.onFetchOrderData}
                    getOrderMeals={this.getOrderMeals}
                    getOrderMealsTotals={this.getOrderMealsTotals}
                    defaultPage={this.state.currentPage}
                    currentOrderId={this.state.currentOrderId}
                  /> :
                  <div>
                  You have not placed an order on this application
                  </div>
                }
                </AccordionItemBody>

              </AccordionItem>

            </Accordion>
          </main>

          <ReactModal
            isOpen={this.state.showOrderModal}
            contentLabel="Input Modal"
            className="modal-content"
            onRequestClose={this.closeCartModal}
            shouldCloseOnOverlayClick
          >
            <aside className="col s12" >
              {isMealSelected ? <ConnectedCartContainer
                order={this.state.currentOrder}
                orderId={this.state.currentOrderId}
                MealRow={MealRow}
                removeFromCart={this.removeMealFromCart}
                clearCart={this.clearOrder}
                closeCart={this.closeCartModal}
                notify={this.notify}
              /> :
              <div>
                <h3>Order Cart</h3>
                <p>
                  No orders here. Select a meal and click the Add to Cart button
                </p>

              </div>
                }
            </aside>
          </ReactModal>

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

Order.defaultProps = {
  menu: [],
  orders: [],
  orderEditMeals: {},
  orderMeals: [],
  orderConnecting: false,
  loadingMeals: false,
  total: 0,
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
  menuPagination: {
    pages: 1,
    count: 1,
    limit: 8
  }
};

Order.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object),
  menu: PropTypes.arrayOf(PropTypes.object),
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
  menuPagination: PropTypes.shape({
    pages: PropTypes.number,
    count: PropTypes.number,
    limit: PropTypes.number,
  }),
  orderConnecting: PropTypes.bool,
  loadingMeals: PropTypes.bool,
  orderEditMeals: PropTypes.shape({
    id: PropTypes.string,
    Meals: PropTypes.arrayOf(PropTypes.object),
  }),
  total: PropTypes.number,
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
    firstName: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
};

export const mapStateToProps = state => ({
  orderError: state.orderReducer.orderError,
  orderMealsError: state.orderReducer.orderMealsError,
  loadingMeals: state.orderReducer.loadingMeals,
  total: state.orderReducer.total,
  pagination: state.orderReducer.pagination,
  mealsPagination: state.orderReducer.mealsPagination,
  menuPagination: state.menuReducer.pagination,
  orderConnecting: state.orderReducer.connecting,
  menuConnecting: state.menuReducer.connecting,
  menu: state.menuReducer.menu,
  orders: state.orderReducer.orders,
  orderEditMeals: state.orderReducer.orderEditMeals,
  orderMeals: state.orderReducer.orderMeals,
  user: state.loginReducer.user
});


export default connect(mapStateToProps)(Order);
