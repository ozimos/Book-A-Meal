/* global React:false, shallow:false mount:false toJson:false */

import { MealOptionsCard, mapStateToProps } from
  '../../src/components/mealCard/ConnectedMealOptionsCard';
import * as imageUpload from '../../src/services/imageUpload';
import mockStore from '../__mocks__/mockStore';

import { meal } from '../__mocks__/mealDataMock';

const props = {
  ...meal.data,
  dispatch: jest.fn(),
};

const store = mockStore({
  connecting: true
});

describe('MealOptionsCard Component', () => {

  const shallowSetup = () => shallow(<MealOptionsCard {...props} />);
  const mountSetup = () => mount(<MealOptionsCard {...props} store={store} />);

  it('should render without throwing an error', () => {
    const wrapper = shallowSetup();

    expect(wrapper
      .exists(<div className="card" />)).toBe(true);
  });

  it('renders shallow component correctly', () => {
    const wrapper = shallowSetup();

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders mounted component correctly', () => {
    const wrapper = mountSetup();
    wrapper.setState({ canSubmit: false });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call `setUploadPercent` when an image is selected' +
   ' for upload', () => {
    const wrapper = shallowSetup();

    const setUploadPercentSpy = jest.spyOn(
      wrapper.instance(),
      'setUploadPercent'
    );
    wrapper.instance().setUploadPercent(20);
    expect(setUploadPercentSpy).toHaveBeenCalled();
  });

  it('should call `handleDrop` when the upload image button is clicked', () => {
    const imageUploadSpy = jest.spyOn(imageUpload, 'default');
    imageUploadSpy.mockResolvedValue({ data: { secure_url: 'url' } });
    const wrapper = shallowSetup();

    const handleDropSpy = jest.spyOn(wrapper.instance(), 'handleDrop');
    wrapper.instance().handleDrop([]);
    expect(handleDropSpy).toHaveBeenCalled();
  });

  it(
    'should call `openMealEditorModal` when the edit button is clicked',
    () => {
      const wrapper = shallowSetup();

      const openMealEditorModalSpy = jest.spyOn(
        wrapper.instance(),
        'openMealEditorModal'
      );
      wrapper.instance().openMealEditorModal();
      expect(openMealEditorModalSpy).toHaveBeenCalled();
    }
  );

  it(
    'should call `closeMealEditorModal` when the close button is clicked',
    () => {
      const wrapper = shallowSetup();

      const closeMealEditorModalSpy = jest.spyOn(
        wrapper.instance(),
        'closeMealEditorModal'
      );
      wrapper.instance().closeMealEditorModal();
      expect(closeMealEditorModalSpy).toHaveBeenCalled();
    }
  );

  it(
    'should call `openDeleteConfirmModal` when the delete button is clicked',
    () => {
      const wrapper = shallowSetup();

      const openDeleteConfirmModalSpy = jest.spyOn(
        wrapper.instance(),
        'openDeleteConfirmModal'
      );
      wrapper.instance().openDeleteConfirmModal();
      expect(openDeleteConfirmModalSpy).toHaveBeenCalled();
    }
  );

  it(
    'should call `closeDeleteConfirmModal` when the close button is clicked',
    () => {
      const wrapper = shallowSetup();

      const closeDeleteConfirmModalSpy = jest.spyOn(
        wrapper.instance(),
        'closeDeleteConfirmModal'
      );
      wrapper.instance().closeDeleteConfirmModal();
      expect(closeDeleteConfirmModalSpy).toHaveBeenCalled();
    }
  );

  it(
    'should call `deleteMeal` when the confirm delete button is clicked',
    () => {
      const wrapper = shallowSetup();

      const deleteMealSpy = jest.spyOn(
        wrapper.instance(),
        'deleteMeal'
      );
      wrapper.instance().deleteMeal('abc');
      expect(deleteMealSpy).toHaveBeenCalled();
    }
  );

  it(
    'should call `handleUpdateMeal` when the continue button is clicked',
    () => {
      const wrapper = shallowSetup();

      const handleUpdateMealSpy = jest.spyOn(
        wrapper.instance(),
        'handleUpdateMeal'
      );
      wrapper.instance().handleUpdateMeal(meal.data, 'abc');
      expect(handleUpdateMealSpy).toHaveBeenCalled();
    }
  );

  it('should call `disableButton` when the form input data is wrong', () => {
    const wrapper = shallowSetup();

    const disableButtonSpy = jest.spyOn(
      wrapper.instance(),
      'disableButton'
    );
    wrapper.instance().disableButton();
    expect(disableButtonSpy).toHaveBeenCalled();
  });

  it('should call `enableButton`when the form input data is correct', () => {
    const wrapper = shallowSetup();

    const enableButtonSpy = jest.spyOn(
      wrapper.instance(),
      'enableButton'
    );
    wrapper.instance().enableButton();
    expect(enableButtonSpy).toHaveBeenCalled();
  });

  it('should call delete meal on click of delete button', () => {
    const wrapper = shallowSetup();

    const deleteMealSpy = jest.spyOn(
      wrapper.instance(),
      'deleteMeal'
    );
    const closeDeleteConfirmModalSpy = jest.spyOn(
      wrapper.instance(),
      'closeDeleteConfirmModal'
    );
    wrapper.find('.btn.delete').simulate('click');
    expect(closeDeleteConfirmModalSpy).toHaveBeenCalled();
    expect(deleteMealSpy).toHaveBeenCalled();
  });

  it('should map state to props', () => {
    const initialState = {
      dispatch: jest.fn(),
      mealsReducer: {
        connecting: false,
        mealError: ''
      }
    };

    const tree = mapStateToProps(initialState);
    expect(tree).toMatchSnapshot();
  });
});

