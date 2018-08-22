import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { menuActions } from '../../redux/actions';

import '../../../public/styles/cart_layout.scss';


class MenuContainer extends React.Component {


 placeOrder = async () => {

   if (this.props.postMenu) {
     await this.props.postMenu(this.props.menu);
   } else {
     await this.props.dispatch(menuActions.postMenu(this.props.menu));
   }
   if (!this.props.menuError) {
     const message = this.props.postMenu ? 'added to' : 'removed from';
     this.props.notify(`The selected meals have been ${message} the menu`);
     this.props.clearMenu();
   }
   if (this.props.menuError) {
     this.props.notify(this.props.menuError);
   }
 }

 render() {
   const { menu, ...rest } = this.props;

   return (
     <div className={rest.addClass ? `${rest.addClass}` : ''}>
       <div className="flexbox cart">
         <h5>Meals List</h5>
         <button className="btn title-button" onClick={rest.closeMenuModal}>
                &#10006;
         </button>
       </div>
       <div className="scroll">
         <ul>
           {menu.map(meal =>
             (
               <li
                 className="text_left"
                 key={meal.id}
               >
                 {meal.title}
               </li>))
        }
         </ul>
         <div className="flexbox">


           <div className="flexbox">
             <button className="btn btn-cart" onClick={this.placeOrder}>
               {this.props.postMenu ?
                'Add meals to Menu' :
                'Remove meals from Menu' }
             </button>

             <button className="btn btn-cart" onClick={rest.clearMenu}>
                   Clear Menu
             </button>
           </div>
         </div>

       </div>
     </div>
   );
 }
}

MenuContainer.defaultProps = {
  addClass: '',
  menuError: '',
};
MenuContainer.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.object).isRequired,
  addClass: PropTypes.string,
  menuError: PropTypes.string,
  clearMenu: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  postMenu: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  menuError: state.menuReducer.menuError,
  connecting: state.menuReducer.connecting,
});
export { MenuContainer };
export default connect(mapStateToProps)(MenuContainer);

