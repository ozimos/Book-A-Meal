/* global React:false, shallow:false toJson:false */

import { MealOptionsCard } from '../mealCard/ConnectedMealOptionsCard';
import { meal } from '../mocks/mealDataMock';

const props = {
  ...meal.data,
  dispatch: jest.fn(),
};
describe('MealCard Component', () => {

  const setup = () => shallow(<MealOptionsCard {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect(wrapper
      .exists(<div className="card" />)).toBe(true);
  });
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
    wrapper.instance().setUploadPercent(20);
    expect(setUploadPercentSpy).toHaveBeenCalled();
  });
  it('should call `handleDrop`', () => {
    const wrapper = setup();

    const handleDropSpy = jest.spyOn(wrapper.instance(), 'handleDrop');
    wrapper.instance().handleDrop([]);
    expect(handleDropSpy).toHaveBeenCalled();
  });
  it('should call `openMealEditorModal`', () => {
    const wrapper = setup();

    const openMealEditorModalSpy = jest.spyOn(
      wrapper.instance(),
      'openMealEditorModal'
    );
    wrapper.instance().openMealEditorModal();
    expect(openMealEditorModalSpy).toHaveBeenCalled();
  });
  it('should call `closeMealEditorModal`', () => {
    const wrapper = setup();

    const closeMealEditorModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeMealEditorModal'
    );
    wrapper.instance().closeMealEditorModal();
    expect(closeMealEditorModalSpy).toHaveBeenCalled();
  });
  it('should call `openDeleteConfirmModal`', () => {
    const wrapper = setup();

    const openDeleteConfirmModalSpy = jest.spyOn(
      wrapper.instance(),
      'openDeleteConfirmModal'
    );
    wrapper.instance().openDeleteConfirmModal();
    expect(openDeleteConfirmModalSpy).toHaveBeenCalled();
  });
  it('should call `closeDeleteConfirmModal`', () => {
    const wrapper = setup();

    const closeDeleteConfirmModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeDeleteConfirmModal'
    );
    wrapper.instance().closeDeleteConfirmModal();
    expect(closeDeleteConfirmModalSpy).toHaveBeenCalled();
  });
  it('should call `deleteMeal`', () => {
    const wrapper = setup();

    const deleteMealSpy = jest.spyOn(
      wrapper.instance(),
      'deleteMeal'
    );
    wrapper.instance().deleteMeal('abc');
    expect(deleteMealSpy).toHaveBeenCalled();
  });
  it('should call `handleUpdateMeal`', () => {
    const wrapper = setup();

    const handleUpdateMealSpy = jest.spyOn(
      wrapper.instance(),
      'handleUpdateMeal'
    );
    wrapper.instance().handleUpdateMeal(meal.data, 'abc');
    expect(handleUpdateMealSpy).toHaveBeenCalled();
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
});

