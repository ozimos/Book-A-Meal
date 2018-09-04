/* global React:false, shallow:false toJson:false */

import { Menu } from '../menu/ConnectedMenu';
import { allMeals, meal } from '../mocks/mealDataMock';

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
  meals: allMeals.data.rows,
  menu: allMeals.data.rows,
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
    const props2 = { ...props, menu };
    const props3 = { ...props, mealsPagination };
    const props4 = { ...props, menuPagination };
    let setup2 = () => shallow(<Menu {...props} />);

    let wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.instance().setState({ currentMenu: allMeals.data.rows });
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Menu {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Menu {...props3} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    setup2 = () => shallow(<Menu {...props4} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should call `notify`', () => {
    const wrapper = setup();

    const notifySpy = jest.spyOn(
      wrapper.instance(),
      'notify'
    );
    wrapper.instance().notify();
    expect(notifySpy).toHaveBeenCalled();
  });
  it('should call `checkMeal`', () => {
    const wrapper = setup();
    wrapper.instance().setState({ currentMenu: allMeals.data.rows });
    const checkMealSpy = jest.spyOn(
      wrapper.instance(),
      'checkMeal'
    );
    wrapper.instance().checkMeal('abc');
    expect(checkMealSpy).toHaveBeenCalled();
  });
  it('should call `addToMenu`', () => {
    const wrapper = setup();
    wrapper.instance().setState({ currentMenu: allMeals.data.rows });

    const addToMenuSpy = jest.spyOn(
      wrapper.instance(),
      'addToMenu'
    );
    wrapper.instance().addToMenu(meal.data);
    expect(addToMenuSpy).toHaveBeenCalled();
  });
  it('should call `addToMenu` when no meals are selected', () => {
    const wrapper = setup();
    const addToMenuSpy = jest.spyOn(
      wrapper.instance(),
      'addToMenu'
    );
    wrapper.instance().addToMenu(meal.data);
    expect(addToMenuSpy).toHaveBeenCalled();
  });
  it('should call `openMenuModal`', () => {
    const wrapper = setup();

    const openMenuModalSpy = jest.spyOn(
      wrapper.instance(),
      'openMenuModal'
    );
    wrapper.instance().openMenuModal();
    expect(openMenuModalSpy).toHaveBeenCalled();
  });
  it('should call `closeMenuModal`', () => {
    const wrapper = setup();

    const closeMenuModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeMenuModal'
    );
    wrapper.instance().closeMenuModal();
    expect(closeMenuModalSpy).toHaveBeenCalled();
  });
  it('should call `postMenu`', () => {
    const wrapper = setup();

    const postMenuSpy = jest.spyOn(
      wrapper.instance(),
      'postMenu'
    );
    wrapper.instance().postMenu();
    expect(postMenuSpy).toHaveBeenCalled();
  });
  it('should call `postMenu` when there is error', () => {
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
  it('should call `removeFromMenu`', () => {
    const wrapper = setup();

    const removeFromMenuSpy = jest.spyOn(
      wrapper.instance(),
      'removeFromMenu'
    );
    wrapper.instance().removeFromMenu('abc');
    expect(removeFromMenuSpy).toHaveBeenCalled();
  });
  it('should call `removeFromMenu` when there is no meal selected', () => {
    const wrapper = setup();
    wrapper.instance().setState({ currentMenu: [] });

    const removeFromMenuSpy = jest.spyOn(
      wrapper.instance(),
      'removeFromMenu'
    );
    wrapper.instance().removeFromMenu('abc');
    expect(removeFromMenuSpy).toHaveBeenCalled();
  });
  it('should call `removeFromMenu` when items are in menu', () => {
    const wrapper = setup();
    wrapper.instance().setState({ currentMenu: allMeals.data.rows });

    const removeFromMenuSpy = jest.spyOn(
      wrapper.instance(),
      'removeFromMenu'
    );
    wrapper.instance().removeFromMenu('abc');
    expect(removeFromMenuSpy).toHaveBeenCalled();
  });
  it('should call `handleMealPaginationClick`', () => {
    const wrapper = setup();

    const handleMealPaginationClickSpy = jest.spyOn(
      wrapper.instance(),
      'handleMealPaginationClick'
    );
    wrapper.instance().handleMealPaginationClick({ selected: 2 });
    expect(handleMealPaginationClickSpy).toHaveBeenCalled();
  });
  it('should call `clearMenu`', () => {
    const wrapper = setup();

    const clearMenuSpy = jest.spyOn(
      wrapper.instance(),
      'clearMenu'
    );
    wrapper.instance().clearMenu();
    expect(clearMenuSpy).toHaveBeenCalled();
  });
  it('should call `handleMenuPaginationClick`', () => {
    const wrapper = setup();

    const handleMenuPaginationClickSpy = jest.spyOn(
      wrapper.instance(),
      'handleMenuPaginationClick'
    );
    wrapper.instance().handleMenuPaginationClick({ selected: 2 });
    expect(handleMenuPaginationClickSpy).toHaveBeenCalled();
  });
});

