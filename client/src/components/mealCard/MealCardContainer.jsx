import React from 'react';
import PropTypes from 'prop-types';


const MealCardContainer = ({ MealCard, meals, ...props }) =>
  (
    <div className={props.addClass ? `${props.addClass} gallery` : 'gallery'}>
      {meals.map(meal => (<MealCard
        key={meal.id}
        {...meal}
        {...props}
      />))
        }
    </div>
  );

MealCardContainer.defaultProps = {
  addClass: ''
};

MealCardContainer.propTypes = {
  meals: PropTypes.arrayOf(PropTypes.object).isRequired,
  MealCard: PropTypes.func.isRequired,
  addClass: PropTypes.string,
};

export default MealCardContainer;

