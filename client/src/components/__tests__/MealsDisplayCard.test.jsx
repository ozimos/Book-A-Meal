/* global React:false, shallow:false toJson:false */

import MealsDisplayCard from '../mealCard/MealDisplayCard';
import { meal } from '../mocks/mealDataMock';

const props = {
  ...meal,
  collection: 'menu'
};

describe('MealsDisplayCard Component', () => {
  const setup = () => shallow(<MealsDisplayCard {...props} />);
  it('renders correctly', () => {
    let wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
    const props2 = { ...props, addToCollection: jest.fn() };
    const setup2 = () => shallow(<MealsDisplayCard {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
    const props3 = { ...props, removeFromCollection: jest.fn() };
    const setup3 = () => shallow(<MealsDisplayCard {...props3} />);
    wrapper = setup3();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

