import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';

import { connect } from 'react-redux';
import { orderActions } from '../../redux/actions';

import '../../../public/styles/cart_layout.scss';


class CartContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orderQuantity: {},
      prevPropsOrderId: this.props.orderId,
      placingOrder: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    const newOrderQuantity = {};

    if (nextProps.orderId !== prevState.prevPropsOrderId) {
      nextProps.order
        .forEach((elem) => {
          newOrderQuantity[elem.id] = elem.MealOrders.quantity;
        });

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
        .forEach((elem) => {
          const quantity = elem.MealOrders ? elem.MealOrders.quantity : 1;
          newOrderQuantity[elem.id] = quantity;
        });

      // eslint-disable-next-line
      this.setState({ orderQuantity: newOrderQuantity });

    }
  }

  setQuantity = (e, id) => {
    let inputValue;

    if (e.target.value < 1) {
      inputValue = '';
    } else if (e.target.value > 99) {
      inputValue = 99;
    } else {
      inputValue = e.target.value;
    }

    this.setState(prevState =>
      ({ orderQuantity: { ...prevState.orderQuantity, [id]: inputValue } }));
  }

 placeOrder = async () => {
   this.setState({ placingOrder: true });
   const actualOrder = this.props.order
     .map(meal => ({ id: meal.id,
       quantity: this.state.orderQuantity[meal.id] || 1 }));

   if (this.props.orderId) {
     await this.props
       .dispatch(orderActions.updateOrder(
         { meals: actualOrder },
         this.props.orderId
       ));
   } else {
     await this.props.dispatch(orderActions.postOrder({ meals: actualOrder }));
   }
   this.setState({ placingOrder: false });

   if (!this.props.orderError) {
     const message = this.props.orderId ? 'modified' : 'created';
     this.props.notify(`Order has been ${message}`);
     this.props.clearCart();
   }

   if (this.props.orderError) {
     this.props.notify(this.props.orderError);
   }
 }

 render() {

   const { MealRow, order, ...rest } = this.props;
   const reducer = (total, meal) =>
     total + (meal.price * (this.state.orderQuantity[meal.id] || 1));
   const calcTotal = () => this.props.order
     .reduce(reducer, 0);
   const total = calcTotal();

   return (
     <div id="order-cart" className={rest.addClass ? `${rest.addClass}` : ''}>

       <div className="flexbox cart" id="order-cart-heading">
         <h5>Order Cart</h5>
         {this.state.placingOrder && <p> ... Processing your order</p>}

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

                 {!this.state.placingOrder &&

                 <button
                   id="place-order"
                   className="btn btn-cart"
                   onClick={this.placeOrder}
                   disabled={this.state.placingOrder}
                 >
                   {this.props.orderId ? 'Modify Order' : 'Place Order' }
                 </button>}
                 {this.state.placingOrder &&
                 <div style={{ width: '20%' }}>
                   <LinearProgress
                     style={{ height: '10px' }}
                   />
                 </div>

     }
                 <button
                   className="btn btn-cart"
                   onClick={rest.clearCart}
                   disabled={this.state.placingOrder}
                 >
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

CartContainer.defaultProps = {
  addClass: '',
  orderError: '',
  orderId: ''
};

CartContainer.propTypes = {
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

export { CartContainer };
export default connect(mapStateToProps)(CartContainer);

