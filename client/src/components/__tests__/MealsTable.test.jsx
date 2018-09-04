/* global React:false, shallow:false toJson:false */

import MealsTable from '../mealCard/MealsTable';
import { rows } from '../mocks/mealDataMock';

const props = {
  mealsPagination: {
    limit: 10,
    offset: 0,
    pages: 1
  },
  currentOrderId: 'abc',
  loading: false,
  meals: rows,
  total: 0,
  closeMealDetailModal: jest.fn(),
  onFetchData: jest.fn(),
};

describe('MealsTable Component', () => {

  const setup = () => shallow(<MealsTable {...props} />);


  it('should render without throwing an error', () => {
    const wrapper = setup();
    expect(wrapper
      .exists(<table className="table" />)).toBe(true);
  });
  it('renders correctly', () => {
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

