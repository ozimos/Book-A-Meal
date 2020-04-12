import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
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
       <div className="flexbox">
         <h5>Menu Editor</h5>
         <button className="btn title-button" onClick={rest.closeMenuModal}>
                &#10006;
         </button>
       </div>

       <div className="scroll">
         {menu.map(meal =>
             (
               <div key={meal.id} className="flexbox">
                 <span
                   className="text_left long_string"
                   key={meal.id}
                 >
                   {meal.title}
                 </span>
                 <button
                   className="btn title-button"
                   onClick={() => rest.removeFromMenu(meal.id)}
                 >
               Remove
                 </button>
               </div>
               ))
        }
       </div>

       <div className="flexbox">

         { !this.props.connecting &&
         <button
           className="btn btn-cart"
           onClick={this.placeOrder}
           disabled={this.props.connecting}
         >
              Post meals to Menu
         </button>
       }
         {this.props.connecting &&
         <div style={{ width: '20%' }}>
           <LinearProgress
             style={{ height: '10px' }}
           />
         </div>

            }
         <button
           className="btn btn-cart"
           onClick={rest.clearMenu}
           disabled={this.props.connecting}
         >
                   Clear Menu
         </button>

       </div>

     </div>
   );
 }
}

MenuContainer.defaultProps = {
  addClass: '',
  menuError: '',
  connecting: false,
};

MenuContainer.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.object).isRequired,
  addClass: PropTypes.string,
  menuError: PropTypes.string,
  connecting: PropTypes.bool,
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

