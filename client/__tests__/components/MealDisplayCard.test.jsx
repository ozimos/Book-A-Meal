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

    const props2 = { ...props, addToCollection: jest.fn() };
    const setup2 = () => shallow(<MealsDisplayCard {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();

    const props3 = { ...props, removeFromCollection: jest.fn() };
    const setup3 = () => shallow(<MealsDisplayCard {...props3} />);
    wrapper = setup3();
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = setup2();
    wrapper.find('button.btn.title-button').simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = setup3();
    wrapper.find('button.btn.title-button').simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

