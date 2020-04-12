/* global React:false, shallow:false toJson:false */

import MealsDisplayCard from '../../src/components/mealCard/MealDisplayCard';
import { meal } from '../__mocks__/mealDataMock';

const props = {
  ...meal,
  collection: 'menu'
};

describe('MealsDisplayCard Component', () => {

  const setup = () => shallow(<MealsDisplayCard {...props} />);

  it('renders correctly', () => {
    let wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();

    const propsWithAddButton = { ...props, addToCollection: jest.fn() };
    const setupWithAddButton = () => shallow(<MealsDisplayCard
      {...propsWithAddButton}
    />);
    wrapper = setupWithAddButton();
    expect(toJson(wrapper)).toMatchSnapshot();

    const propsWithRemoveButton = { ...props, removeFromCollection: jest.fn() };
    const setupWithRemoveButton = () => shallow(<MealsDisplayCard
      {...propsWithRemoveButton}
    />);
    wrapper = setupWithRemoveButton();
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = setupWithAddButton();
    wrapper.find('button.btn.title-button').simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = setupWithRemoveButton();
    wrapper.find('button.btn.title-button').simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

