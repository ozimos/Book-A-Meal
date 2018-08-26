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
import 'react-toastify/dist/ReactToastify.css';
import MealDisplayCard from '../mealCard/MealDisplayCard';
import MealRow from '../orderCart/MealRow';
import ConnectedCartContainer from '../orderCart/ConnectedCartContainer';
import MealCardContainer from '../mealCard/MealCardContainer';
import OrderContainer from '../mealCard/OrderContainer';
import Greeting from '../greeting/Greeting';
import { menuActions, orderActions } from '../../redux/actions';
import ConnectedNav from '../nav/ConnectedNav';
import '../../../public/styles/bookameal.scss';
import '../../../public/styles/search-input.css';
import '../../../public/styles/accordion.css';

ReactModal.setAppElement(document.getElementById('root'));
class Order extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      currentOrder: [],
      currentOrderId: '',
      showOrderModal: false,
    };
    this.openCartModal = this.openCartModal.bind(this);
    this.closeCartModal = this.closeCartModal.bind(this);
    this.removeMealFromCart = this.removeMealFromCart.bind(this);
    this.clearOrder = this.clearOrder.bind(this);
    this.addOrderToCart = this.addOrderToCart.bind(this);
    this.addMealToCart = this.addMealToCart.bind(this);
    this.notify = this.notify.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(menuActions.getMenu());
    this.props.dispatch(orderActions.getOrdersWithMealLinks());
  }
  getNextPage = () => {
    const { offset, limits } = this.props.pagination;
    this.props.dispatch(orderActions
      .getOrdersWithMealLinks({ limits, offset }));
  }
  openCartModal() {
    return this.setState({ showOrderModal: true });
  }
  closeCartModal() { return this.setState({ showOrderModal: false }); }
  notify = message => toast(message, { className: 'toaster' });
  addMealToCart(meal) {
    if (this.state.currentOrderId) {
      return toast(
        'New meals cannot be added to existing orders',
        { className: 'toaster' }
      );
    }
    const inOrder = this.state.currentOrder.some(elem => elem.id === meal.id);
    if (!inOrder) {
      this.setState(prevState =>
        ({ currentOrder: [...prevState.currentOrder, meal] }));
      toast('Meal has been added to cart', { className: 'toaster' });
    } else {
      toast('Meal is already in cart', { className: 'toaster' });
    }
  }
  addOrderToCart(id) {
    const order = this.props.orders.find(elem => elem.id === id);
    this.setState({ currentOrder: order.Meals, currentOrderId: id });
    toast('Meal has been added to cart for editing', { className: 'toaster' });
  }
  removeMealFromCart(id) {
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
  clearOrder() {
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
    const isMealSelected = this.state.currentOrder.length !== 0;
    const isTodayOrder = this.props.orders.length !== 0;
    let filteredMeals;
    if (isMenuSet) {
      filteredMeals = this.props.menu
        .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    }
    const { isCaterer, firstName } = this.props.user;
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
                  {isMenuSet ? <MealCardContainer
                    meals={filteredMeals}
                    MealCard={MealDisplayCard}
                    addToCollection={this.addMealToCart}
                    collection="cart"
                    addClass="scroll"
                  /> :
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
                  { isTodayOrder ? <OrderContainer
                    orders={this.props.orders}
                    loading={this.props.orderConnecting}
                    pagination={this.props.pagination}
                    addOrderToCart={this.addOrderToCart}
                    onFetchData={this.getNextPage}
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
        </div>

      </div>
    );
  }
}
Order.defaultProps = {
  menu: [],
  orders: [],
  orderConnecting: false
};
Order.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object),
  menu: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.shape({
    pages: PropTypes.number,
    limits: PropTypes.number,
    offset: PropTypes.number
  }).isRequired,
  orderConnecting: PropTypes.bool,
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
    firstName: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
};
const mapStateToProps = state => ({
  orderError: state.orderReducer.orderError,
  pagination: state.orderReducer.pagination,
  orderConnecting: state.orderReducer.connecting,
  menuConnecting: state.menuReducer.connecting,
  menu: state.menuReducer.menu,
  orders: state.orderReducer.orders,
  user: state.loginReducer.user.data
});

export { Order };
export default connect(mapStateToProps)(Order);
