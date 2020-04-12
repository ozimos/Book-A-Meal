/* global React:false, shallow:false toJson:false */

import { Menu } from '../../src/components/menu/ConnectedMenu';
import { Meals, meal } from '../__mocks__/mealDataMock';
import { menuMeals } from '../__mocks__/menuDataMock';

const props = {
  menuPagination: {
    limit: 8,
    offset: 1,
    pages: 1
  },
  mealsPagination: {
    limit: 8,
    offset: 1,
    pages: 1
  },
  mealError: '',
  menuError: '',
  meals: Meals,
  menu: menuMeals,
  user: { isCaterer: true, firstName: 'user' },
  dispatch: jest.fn(),
};

describe('Menu Component', () => {
  const setup = () => shallow(<Menu {...props} />);


  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect((wrapper)
      .exists(<div className="title-element flexbox" />)).toBe(true);
  });

  it('renders correctly', () => {
    const menu = [];
    const menuPagination = {
      pages: 1
    };
    const mealsPagination = {
      pages: 1
    };
    const propsEmptyMenu = { ...props, menu };
    const propsNoMealPaginationParams = { ...props, mealsPagination };
    const propsNoPaginationParams = { ...props, menuPagination };
    let snapshotSetup = () => shallow(<Menu {...props} />);

    let wrapper = snapshotSetup();
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.instance().setState({ currentMenu: menuMeals });
    expect(toJson(wrapper)).toMatchSnapshot();

    snapshotSetup = () => shallow(<Menu {...propsEmptyMenu} />);
    wrapper = snapshotSetup();
    expect(toJson(wrapper)).toMatchSnapshot();

    snapshotSetup = () => shallow(<Menu {...propsNoMealPaginationParams} />);
    wrapper = snapshotSetup();
    expect(toJson(wrapper)).toMatchSnapshot();

    snapshotSetup = () => shallow(<Menu {...propsNoPaginationParams} />);
    wrapper = snapshotSetup();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `notify` on clicking the add button to add' +
   ' a meal to the menu', () => {
    const wrapper = setup();

    const notifySpy = jest.spyOn(
      wrapper.instance(),
      'notify'
    );
    wrapper.instance().notify();
    expect(notifySpy).toHaveBeenCalled();
  });

  it('should call `addToMenu`on clicking the add button to add' +
  ' a meal to the menu', () => {
    const wrapper = setup();
    wrapper.instance().setState({ currentMenu: menuMeals });

    const addToMenuSpy = jest.spyOn(
      wrapper.instance(),
      'addToMenu'
    );
    wrapper.instance().addToMenu(meal);
    expect(addToMenuSpy).toHaveBeenCalled();
  });

  it('should call `addToMenu` on clicking the add button' +
   ' when no meals are selected', () => {
    const wrapper = setup();
    const addToMenuSpy = jest.spyOn(
      wrapper.instance(),
      'addToMenu'
    );
    wrapper.instance().addToMenu(meal);
    expect(addToMenuSpy).toHaveBeenCalled();
  });

  it('should call `openMenuModal` when the menu cart is clicked', () => {
    const wrapper = setup();

    const openMenuModalSpy = jest.spyOn(
      wrapper.instance(),
      'openMenuModal'
    );
    wrapper.instance().openMenuModal();
    expect(openMenuModalSpy).toHaveBeenCalled();
  });

  it('should call `closeMenuModal` when the' +
   ' menu cart close button is clicked', () => {
    const wrapper = setup();

    const closeMenuModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeMenuModal'
    );
    wrapper.instance().closeMenuModal();
    expect(closeMenuModalSpy).toHaveBeenCalled();
  });

  it('should call `postMenu` when the post menu button is clicked', () => {
    const wrapper = setup();

    const postMenuSpy = jest.spyOn(
      wrapper.instance(),
      'postMenu'
    );
    wrapper.instance().postMenu();
    expect(postMenuSpy).toHaveBeenCalled();
  });

  it('should call `postMenu` when there is menu error' +
   ' and menu is not posted ', () => {
    const props2 = { ...props, menuError: 'abc' };
    const setup2 = () => shallow(<Menu {...props2} />);
    const wrapper = setup2();

    const postMenuSpy = jest.spyOn(
      wrapper.instance(),
      'postMenu'
    );
    wrapper.instance().postMenu();
    expect(postMenuSpy).toHaveBeenCalled();
  });

  it('should call `removeFromMenu` when the delete button is clicked', () => {
    const wrapper = setup();

    const removeFromMenuSpy = jest.spyOn(
      wrapper.instance(),
      'removeFromMenu'
    );
    wrapper.instance().removeFromMenu('abc');
    expect(removeFromMenuSpy).toHaveBeenCalled();
  });

  it('should call `removeFromMenu` when there is no meal in the menu', () => {
    const wrapper = setup();
    wrapper.instance().setState({ currentMenu: [] });

    const removeFromMenuSpy = jest.spyOn(
      wrapper.instance(),
      'removeFromMenu'
    );
    wrapper.instance().removeFromMenu('abc');
    expect(removeFromMenuSpy).toHaveBeenCalled();
  });

  it('should call `removeFromMenu` when meals are in menu', () => {
    const wrapper = setup();
    wrapper.instance().setState({ currentMenu: menuMeals });

    const removeFromMenuSpy = jest.spyOn(
      wrapper.instance(),
      'removeFromMenu'
    );
    wrapper.instance().removeFromMenu('abc');
    expect(removeFromMenuSpy).toHaveBeenCalled();
  });

  it('should call `handleMealPaginationClick` when ' +
  'the meal pagination button is clicked', () => {
    const wrapper = setup();

    const handleMealPaginationClickSpy = jest.spyOn(
      wrapper.instance(),
      'handleMealPaginationClick'
    );
    wrapper.instance().handleMealPaginationClick({ selected: 2 });
    expect(handleMealPaginationClickSpy).toHaveBeenCalled();
  });

  it('should call `clearMenu` when the clear menu button is clicked', () => {
    const wrapper = setup();

    const clearMenuSpy = jest.spyOn(
      wrapper.instance(),
      'clearMenu'
    );
    wrapper.instance().clearMenu();
    expect(clearMenuSpy).toHaveBeenCalled();
  });

  it('should call `handleMenuPaginationClick` when the menu' +
   ' pagination button is clicked', () => {
    const wrapper = setup();

    const handleMenuPaginationClickSpy = jest.spyOn(
      wrapper.instance(),
      'handleMenuPaginationClick'
    );
    wrapper.instance().handleMenuPaginationClick({ selected: 2 });
    expect(handleMenuPaginationClickSpy).toHaveBeenCalled();
  });
});

