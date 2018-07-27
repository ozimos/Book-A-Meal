import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
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
import MealCard3 from '../mealCard/MealCard3';
import MealRow from '../orderCart/MealRow';
import CartContainer from '../orderCart/CartContainer';
import OrderItem from '../orderCart/OrderItem';
import MealCardContainer from '../mealCard/MealCardContainer';
import OrderContainer from '../mealCard/OrderContainer';
import Greeting from '../greeting/Greeting';
import { menuActions, orderActions } from '../../redux/actions';
import ConnectedNav from '../nav/Nav';
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
      showModal: false,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.clearOrder = this.clearOrder.bind(this);
    this.addOrder = this.addOrder.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.notify = this.notify.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(menuActions.getMenu());
    this.props.dispatch(orderActions.getUserOrdersByDate());
  }
  handleOpenModal() {
    return this.setState({ showModal: true });
  }
  handleCloseModal() { return this.setState({ showModal: false }); }
  notify = message => toast(message, { className: 'toaster' });
  addToOrder(meal) {
    if (this.state.currentOrderId) {
      return toast('New meals cannot be added to existing orders', { className: 'toaster' });
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
  addOrder(id) {
    const order = this.props.orders.find(elem => elem.id === id);
    this.setState({ currentOrder: order.Meals, currentOrderId: id });
    toast('Meal has been added to cart for editing', { className: 'toaster' });
  }
  removeFromOrder(id) {
    if (this.state.currentOrder.length <= 1) {
      toast.error('There must be at least one meal in the cart. Use the clear cart button to clear cart', { className: 'toaster' });
    } else {
      this.setState(prevState =>
        ({ currentOrder: prevState.currentOrder.filter(elem => elem.id !== id) }));
    }
  }
  clearOrder() {
    this.setState({ currentOrder: [], currentOrderId: '' });
    this.handleCloseModal();
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
        <Greeting isCaterer={isCaterer} firstName={firstName} />
        <div className="row">
          <main className="col s12">
            <ToastContainer autoClose={2000} />
            <Accordion accordion={false}>
              <AccordionItem expanded>
                <AccordionItemTitle>
                  <div className="title-element flexbox">
                    <h4 className="long_string">
                  Today&#39;s Menu
                    </h4>
                    <div className="accordion__arrow u-position-relative" role="presentation" />
                  </div>
                </AccordionItemTitle>
                <AccordionItemBody>
                  <div className="flexbox">
                    <SearchInput className="search-input input-field" onChange={this.searchUpdated} />
                    <button className="btn title-button" onClick={this.handleOpenModal} disabled={!isMealSelected} >
                      <p className="cart-notification">Cart<span className="badge">{this.state.currentOrder.length}</span></p>
                    </button>
                  </div>
                  {isMenuSet ? <MealCardContainer
                    meals={filteredMeals}
                    MealCard={MealCard3}
                    addToOrder={this.addToOrder}
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
                      Your Orders for Today
                    </h4>
                    <div className="accordion__arrow u-position-relative" role="presentation" />
                  </div>
                </AccordionItemTitle>
                <AccordionItemBody>
                  <p className="mr-auto">
                    {`Orders can only be edited up to ${process.env.ORDER_INTERVAL_HOUR || 4} hours after booking`}
                  </p>
                  { isTodayOrder ? <OrderContainer
                    orders={this.props.orders}
                    OrderItem={OrderItem}
                    addOrder={this.addOrder}
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
            isOpen={this.state.showModal}
            contentLabel="Input Modal"
            className="modal-content"
            onRequestClose={this.handleCloseModal}
            shouldCloseOnOverlayClick
          >
            <aside className="col s12" >
              {isMealSelected ? <CartContainer
                order={this.state.currentOrder}
                orderId={this.state.currentOrderId}
                MealRow={MealRow}
                removeFromCart={this.removeFromOrder}
                clearCart={this.clearOrder}
                closeCart={this.handleCloseModal}
                notify={this.notify}
              /> :
              <div>
                <h3>Order Cart</h3>
                <p>No orders here. Select a meal and click the Add to Cart button</p>

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
  orders: []
};
Order.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object),
  menu: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
    firstName: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
};
const mapStateToProps = state => ({
  orderError: state.orderReducer.orderError,
  connecting: state.orderReducer.connecting,
  menu: state.menuReducer.menu.Meals,
  orders: state.orderReducer.orders,
  user: state.loginReducer.user.data
});

export { Order };
export default connect(mapStateToProps)(hot(module)(Order));
