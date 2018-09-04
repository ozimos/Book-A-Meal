/* global React:false, shallow:false toJson:false */
import { MealManager } from '../mealManager/ConnectedMealManager';
import { allMeals } from '../mocks/mealDataMock';

const props = {
  pagination: {
    limit: 8,
    offset: 1,
    pages: 1
  },
  mealError: '',
  connecting: false,
  meals: allMeals.data.rows,
  user: { isCaterer: true, firstName: 'user' },
  dispatch: jest.fn(),
};

describe('MealManager Component', () => {
  const setup = () => shallow(<MealManager {...props} />);

  it('renders correctly', () => {
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should call `setUploadPercent`', () => {
    const wrapper = setup();

    const setUploadPercentSpy = jest.spyOn(
      wrapper.instance(),
      'setUploadPercent'
    );
    wrapper.instance().setUploadPercent();
    expect(setUploadPercentSpy).toHaveBeenCalled();
  });
  it('should call `handleImageDrop`', () => {
    const wrapper = setup();

    const handleImageDropSpy = jest.spyOn(
      wrapper.instance(),
      'handleImageDrop'
    );
    wrapper.instance().handleImageDrop([]);
    expect(handleImageDropSpy).toHaveBeenCalled();
  });
  it('should call `openNewMealModal`', () => {
    const wrapper = setup();

    const openNewMealModalSpy = jest.spyOn(
      wrapper.instance(),
      'openNewMealModal'
    );
    wrapper.instance().openNewMealModal();
    expect(openNewMealModalSpy).toHaveBeenCalled();
  });
  it('should call `closeNewMealModal`', () => {
    const wrapper = setup();

    const closeNewMealModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeNewMealModal'
    );
    wrapper.instance().closeNewMealModal();
    expect(closeNewMealModalSpy).toHaveBeenCalled();
  });
  it('should call `disableButton`', () => {
    const wrapper = setup();

    const disableButtonSpy = jest.spyOn(
      wrapper.instance(),
      'disableButton'
    );
    wrapper.instance().disableButton();
    expect(disableButtonSpy).toHaveBeenCalled();
  });
  it('should call `enableButton`', () => {
    const wrapper = setup();

    const enableButtonSpy = jest.spyOn(
      wrapper.instance(),
      'enableButton'
    );
    wrapper.instance().enableButton();
    expect(enableButtonSpy).toHaveBeenCalled();
  });
  it('should call `searchUpdated`', () => {
    const wrapper = setup();

    const searchUpdatedSpy = jest.spyOn(
      wrapper.instance(),
      'searchUpdated'
    );
    wrapper.instance().searchUpdated('allow');
    expect(searchUpdatedSpy).toHaveBeenCalled();
  });
  it('should call `handlePaginationClick`', () => {
    const wrapper = setup();

    const handlePaginationClickSpy = jest.spyOn(
      wrapper.instance(),
      'handlePaginationClick'
    );
    wrapper.instance().handlePaginationClick({ selected: 1 });
    expect(handlePaginationClickSpy).toHaveBeenCalled();
  });
});
