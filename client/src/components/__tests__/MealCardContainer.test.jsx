/* global React:false, shallow:false toJson:false */

import MealCardContainer from '../mealCard/MealCardContainer';
import { rows } from '../mocks/mealDataMock';

const props = {
  meals: rows,
  MealCard: jest.fn(),
};

describe('MealCardContainer Component', () => {
  const setup = () => shallow(<MealCardContainer {...props} />);
  it('renders correctly', () => {
    let wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
    const props2 = { ...props, addClass: 'string' };
    const setup2 = () => shallow(<MealCardContainer {...props2} />);
    wrapper = setup2();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
