import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderActions } from '../../redux/actions';

import '../../../public/styles/cart_layout.scss';


class PlainCartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderQuantity: {},
      prevPropsOrderId: this.props.orderId
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const newOrderQuantity = {};
    if (nextProps.orderId !== prevState.prevPropsOrderId) {
      nextProps.order
        .forEach((elem) => { newOrderQuantity[elem.id] = elem.MealOrders.quantity; });
      return {
        prevPropsOrderId: nextProps.orderId,
        orderQuantity: newOrderQuantity };
    }
    return null;
  }
  componentDidMount() {
    if (this.props.orderId) {
      const newOrderQuantity = {};

      this.props.order
        .forEach((elem) => { newOrderQuantity[elem.id] = elem.MealOrders.quantity; });
      // eslint-disable-next-line
      this.setState({ orderQuantity: newOrderQuantity });

    }
  }
  setQuantity = (e, id) => {
    const inputValue = e.target.value;
    this.setState(prevState =>
      ({ orderQuantity: { ...prevState.orderQuantity, [id]: inputValue } }));
  };
 placeOrder = async () => {
   const actualOrder = this.props.order
     .map(meal => ({ id: meal.id,
       quantity: this.state.orderQuantity[meal.id] || 1 }));
   if (this.props.orderId) {
     await this.props
       .dispatch(orderActions.updateOrder({ meals: actualOrder }, this.props.orderId));
   } else {
     await this.props.dispatch(orderActions.postOrder({ meals: actualOrder }));
   }
   if (!this.props.orderError) {
     this.props.notify('Order has been created');
     this.props.clearCart();
   }
   if (this.props.orderError) {
     this.props.notify(this.props.orderError);
   }
 }

 render() {
   const { MealRow, order, ...rest } = this.props;
   const reducer = (total, meal) => total + (meal.price * (this.state.orderQuantity[meal.id] || 1));
   const calcTotal = () => this.props.order
     .reduce(reducer, 0);
   const total = calcTotal();
   return (
     <div className={rest.addClass ? `${rest.addClass}` : ''}>
       <div className="flexbox cart">
         <h5>Order Cart</h5>
         <button className="btn title-button" onClick={rest.closeCart}>
                &#10006;
         </button>
       </div>
       <div className="responsive-table">
         <table className="table">
           <thead>
             <tr>
               <th>Meal Title</th>
               <th>Price (&#x20a6;)</th>
               <th>Quantity</th>
               <th>Subtotal (&#x20a6;)</th>
               <th />
             </tr>
           </thead>
           <tbody>
             {order.map(meal => (<MealRow
               key={meal.id}
               {...meal}
               setQuantity={this.setQuantity}
               quantity={(this.state.orderQuantity[meal.id] || '')}
               {...rest}
             />))
        }
           </tbody>
           <caption className="flexbox-cart">
             <div className="flexbox">
               <div className="flexbox info">
                 <p> Order Total </p>
                 <p > &#x20a6;{total}</p>
               </div>

               <div className="flexbox info">
                 <button className="btn btn-cart" onClick={this.placeOrder}>
                   {this.props.orderId ? 'Modify Order' : 'Place Order' }
                 </button>

                 <button className="btn btn-cart" onClick={rest.clearCart}>
                   Clear Cart
                 </button>
               </div>
             </div>
           </caption>
         </table>
       </div>
     </div>
   );
 }
}

PlainCartContainer.defaultProps = {
  addClass: '',
  orderError: '',
  orderId: ''
};
PlainCartContainer.propTypes = {
  order: PropTypes.arrayOf(PropTypes.object).isRequired,
  MealRow: PropTypes.func.isRequired,
  addClass: PropTypes.string,
  orderId: PropTypes.string,
  orderError: PropTypes.string,
  clearCart: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  orderError: state.orderReducer.orderError,
  connecting: state.orderReducer.connecting,
});
export { PlainCartContainer };
export default connect(mapStateToProps)(PlainCartContainer);

