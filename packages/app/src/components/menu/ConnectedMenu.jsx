import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import 'react-toastify/dist/ReactToastify.css';
import SearchInput, { createFilter } from 'react-search-input';
import MealDisplayCard from '../mealCard/MealDisplayCard';
import ConnectedMenuContainer from '../orderCart/ConnectedMenuContainer';
import MealCardContainer from '../mealCard/MealCardContainer';
import Greeting from '../greeting/Greeting';
import { mealActions, menuActions } from '../../redux/actions';
import ConnectedNav from '../nav/ConnectedNav';
import '../../../public/styles/bookameal.scss';
import '../../../public/styles/modalOpenButton.scss';
import '../../../public/styles/search-input.css';
import '../../../public/styles/accordion.css';

ReactModal.setAppElement(document.getElementById('root'));
class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenuModal: false,
      currentMenu: [],
      searchTerm: '',
    };
    this.addToMenu = this.addToMenu.bind(this);
    this.postMenu = this.postMenu.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(mealActions.getAllMeals());
    this.props.dispatch(menuActions.getMenu());
  }

notify = message => toast(message, { className: 'toaster' });

addToMenu(meal) {
  const inMenu = this.state.currentMenu.some(elem => elem.id === meal.id);

  if (!inMenu) {
    this.setState(prevState =>
      ({ currentMenu: [...prevState.currentMenu, meal] }));
    toast.success('Meal has been added to menu cart', { className: 'toaster' });
  } else {
    toast.error('Meal is already in menu cart', { className: 'toaster' });
  }
}
  openMenuModal = () => this.setState({ showMenuModal: true })

  closeMenuModal= () => this.setState({ showMenuModal: false })

  searchUpdated = (term) => {
    this.setState({ searchTerm: term });
  }

  async postMenu(menu, meals, msg) {
    const mealList = meals || this.state.currentMenu.map(meal => meal.id);
    await this.props.dispatch(menuActions.postMenu({ meals: mealList }));
    this.clearMenu();
    if (this.props.menuError) {
      toast.error(this.props.menuError, { className: 'toaster' });
    } else {
      toast.success(
        msg || 'Menu for the day has been posted',
        { className: 'toaster' }
      );
    }
  }

  removeFromMenu = (id) => {
    const inMenu = this.state.currentMenu.some(elem => elem.id === id);

    if (inMenu) {

      this.setState(prevState =>
        ({ currentMenu: prevState
          .currentMenu.filter(elem => elem.id !== id) }));
      toast.success(
        'Meal was sucessfully removed',
        { className: 'toaster' }
      );

      if (this.state.currentMenu.length <= 1) {
        this.closeMenuModal();
      }

    } else {

      toast.error(
        'Meal is not in menu',
        { className: 'toaster' }
      );

    }
  }

  handleMealPaginationClick = (pages) => {
    const { limit } = this.props.mealsPagination;
    const nextOffset = (pages.selected) * limit;
    this.props.dispatch(mealActions.getAllMeals({ limit, offset: nextOffset }));
  }

  clearMenu = () => {
    this.setState({ currentMenu: [] });
    this.closeMenuModal();
  }

  handleMenuPaginationClick = (pages) => {
    const { limit } = this.props.menuPagination;
    const nextOffset = (pages.selected) * limit;
    this.props.dispatch(menuActions.getMenu({ limit, offset: nextOffset }));
  }

  render() {
    const KEYS_TO_FILTERS = ['id', 'title', 'description', 'price'];

    const filteredMeals = this.props.meals.length ? this.props.meals
      .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)) : [];
    const { isCaterer, firstName } = this.props.user;
    const isMenuSet = this.props.menu.length !== 0;
    const mealPages = this.props.mealsPagination.pages;
    const menuPages = this.props.menuPagination.pages;
    const isMealSelected = this.state.currentMenu.length !== 0;

    return (
      <div className="contain">

        <header className="header">
          <ConnectedNav />
        </header>

        <main>

          <ToastContainer autoClose={2000} />

          <div className="flexbox">

            <Greeting isCaterer={isCaterer} firstName={firstName} />

            <button
              id="menu-cart-button"
              className="btn title-button"
              onClick={this.openMenuModal}
              disabled={!isMealSelected}
            >

              <p
                className="cart-notification"
              >
                      Menu

                <span className="badge">
                  {this.state.currentMenu.length}
                </span>

              </p>

            </button>

          </div>

          <Accordion accordion>

            <AccordionItem expanded>

              <AccordionItemTitle>

                <div className="title-element flexbox">

                  <h5>
                  Your Meals
                  </h5>

                  <div
                    className="accordion__arrow u-position-relative"
                    role="presentation"
                  />
                </div>

              </AccordionItemTitle>

              <AccordionItemBody>

                <SearchInput
                  className="search-input input-field"
                  onChange={this.searchUpdated}
                />

                <MealCardContainer
                  meals={filteredMeals}
                  MealCard={MealDisplayCard}
                  collection="Menu"
                  addToCollection={this.addToMenu}
                  addClass="scroll"

                />

                <ReactPaginate
                  previousLabel="previous"
                  nextLabel="next"
                  pageCount={mealPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handleMealPaginationClick}
                  containerClassName="pagination"
                  subContainerClassName="pages pagination"
                  activeClassName="active"
                />
              </AccordionItemBody>

            </AccordionItem>

            <AccordionItem>

              <AccordionItemTitle>

                <div className="title-element flexbox wrap">

                  <h5>
          Today&#39;s Menu
                  </h5>

                  <div
                    className="accordion__arrow u-position-relative"
                    role="presentation"
                  />

                </div>

              </AccordionItemTitle>

              <AccordionItemBody>

                <div className="title-element flexbox">

                  <button
                    className="title-button btn"
                    onClick={() =>
                      this.postMenu(null, [], 'Menu has been cleared')
                  }
                  >
                    <p>Clear Menu</p>
                  </button>

                </div>

                {
                  isMenuSet ?

                    <div>

                      <MealCardContainer
                        meals={this.props.menu}
                        MealCard={MealDisplayCard}
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
                    <div className="menu-message">
                  You have not added meals to the menu.
                   Select a meal from the meal section
                   above to add meal to menu.
                    </div>
                 }

              </AccordionItemBody>

            </AccordionItem>

          </Accordion>
        </main>

        <ReactModal
          isOpen={this.state.showMenuModal}
          contentLabel="Input Modal"
          className="modal-content"
          onRequestClose={this.openMenuModal}
          shouldCloseOnOverlayClick
        >
          <aside className="col s12" >

            {isMealSelected ?

              <ConnectedMenuContainer
                menu={this.state.currentMenu}
                postMenu={this.postMenu}
                removeFromMenu={this.removeFromMenu}
                clearMenu={this.clearMenu}
                closeMenuModal={this.closeMenuModal}
                notify={this.notify}
              /> :

              <div>
                <h3>Menu</h3>
                <p>
                  No meals here. Select a meal and click the Add to Menu button
                </p>
              </div>

                }
          </aside>

        </ReactModal>

      </div>
    );
  }
}

Menu.defaultProps = {
  menu: [],
  meals: [],
  menuError: null,
  menuPagination: {
    pages: 1,
    count: 1,
    limit: 8
  },
  mealsPagination: {
    pages: 1,
    count: 1,
    limit: 8
  }
};

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  meals: PropTypes.arrayOf(PropTypes.object),
  menu: PropTypes.arrayOf(PropTypes.object),
  menuError: PropTypes.string,
  menuPagination: PropTypes.shape({
    pages: PropTypes.number,
    count: PropTypes.number,
    limit: PropTypes.number,
  }),
  mealsPagination: PropTypes.shape({
    pages: PropTypes.number,
    count: PropTypes.number,
    limit: PropTypes.number,
  }),
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
    firstName: PropTypes.string
  }).isRequired,
};

const mapStateToProps = state => ({
  mealError: state.mealsReducer.mealError,
  menuError: state.menuReducer.menuError,
  menuConnecting: state.menuReducer.connecting,
  mealsConnecting: state.mealsReducer.connecting,
  meals: state.mealsReducer.meals,
  mealsPagination: state.mealsReducer.pagination,
  menuPagination: state.menuReducer.pagination,
  menu: state.menuReducer.menu,
  authenticated: state.loginReducer.authenticated,
  user: state.loginReducer.user
});

export { Menu };
export default connect(mapStateToProps)(Menu);
