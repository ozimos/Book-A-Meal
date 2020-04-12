/* global React:false, shallow:false toJson:false */
import { MealManager, mapStateToProps } from
  '../../src/components/mealManager/ConnectedMealManager';


import { allMeals, meal } from '../__mocks__/mealDataMock';
import * as imageUpload from '../../src/services/imageUpload';

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

    let wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();

    const propsWhenConnecting = { ...props, meals: [], connecting: true };
    wrapper = shallow(<MealManager {...propsWhenConnecting} />);
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.setState({
      canSubmit: false, displayImage: true, uploading: false
    });
    expect(toJson(wrapper)).toMatchSnapshot();

  });

  it('should call `setUploadPercent` when an image is selected', () => {
    const wrapper = setup();

    const setUploadPercentSpy = jest.spyOn(
      wrapper.instance(),
      'setUploadPercent'
    );

    wrapper.instance().setUploadPercent();
    expect(setUploadPercentSpy).toHaveBeenCalled();
  });

  it(
    'should call `handleImageDrop` when the upload image button is clicked',
    () => {

      const imageUploadSpy = jest.spyOn(imageUpload, 'default');
      imageUploadSpy.mockResolvedValue({ data: { secure_url: 'url' } });
      const wrapper = setup();

      const handleImageDropSpy = jest.spyOn(
        wrapper.instance(),
        'handleImageDrop'
      );

      wrapper.instance().handleImageDrop([]);
      expect(handleImageDropSpy).toHaveBeenCalled();
    }
  );

  it(
    'should call `openNewMealModal`when the add meal button is clicked',
    () => {
      const wrapper = setup();

      const openNewMealModalSpy = jest.spyOn(
        wrapper.instance(),
        'openNewMealModal'
      );
      wrapper.instance().openNewMealModal();
      expect(openNewMealModalSpy).toHaveBeenCalled();
    }
  );

  it('should call `closeNewMealModal` when the close button is clicked', () => {

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

  it('should call `handleCreateMeal`', () => {
    const wrapper = setup();

    const handleCreateMealSpy = jest.spyOn(
      wrapper.instance(),
      'handleCreateMeal'
    );
    wrapper.instance().handleCreateMeal(meal.data);
    expect(handleCreateMealSpy).toHaveBeenCalled();
  });

  it('should map state to props', () => {
    const initialState = {
      loginReducer: {
        authenticated: true,
        user: {
          isCaterer: true
        }
      },
      mealsReducer: {
        mealError: '',
        pagination: {
          limit: 10,
          offset: 0
        },
        connecting: false,
        meals: []
      }
    };

    const tree = mapStateToProps(initialState);
    expect(tree).toMatchSnapshot();
  });
});
