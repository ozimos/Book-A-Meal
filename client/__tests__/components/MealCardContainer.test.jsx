/* global React:false, shallow:false toJson:false */

import MealCardContainer from '../../src/components/mealCard/MealCardContainer';
import { Meals } from '../__mocks__/mealDataMock';

const props = {
  meals: Meals,
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
