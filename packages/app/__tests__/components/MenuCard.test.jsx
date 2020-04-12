/* global React:false, shallow:false toJson:false */

import MealDisplayCard from '../../src/components/mealCard/MealDisplayCard';
import { meal } from '../__mocks__/mealDataMock';

describe('MealDisplayCard Component', () => {

  it('should render without throwing an error', () => {
    expect(shallow(<MealDisplayCard
      {...meal.data}
      dispatch={jest.fn()}
      addToMenu={jest.fn()}
      removeFromMenu={jest.fn()}
    />)
      .exists(<div className="card" />)).toBe(true);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<MealDisplayCard
      {...meal.data}
      dispatch={jest.fn()}
      addToMenu={jest.fn()}
      removeFromMenu={jest.fn()}
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

