import React from 'react';
import PropTypes from 'prop-types';

const MealDisplayCard = ({
  id,
  title,
  imageUrl,
  price,
  description,
  ...props }) => {
  // const checked = props.checkMeal(id);
  const meal = { id, title, imageUrl, price, description };
  return (
    <React.Fragment>
      <div className="card">
        <div className="overlay-container">
          <div className="overlay" >
            <div className="flexbox">
              <span className="long_string">
                {title}
              </span>
              <span>
                &#8358;{price}
              </span>
            </div>
          </div>
          <img src={imageUrl} alt="Meal" className="fluid-img" />
        </div>
        <p className="descrip long_string">
          {description}
        </p>
        {props.addToCollection &&
          <button
            className="btn title-button"
            onClick={() => props.addToCollection(meal)}
          >
            {`Add to ${props.collection}`}
          </button>}
        {props.removeFromCollection &&
          <button
            className="btn title-button"
            onClick={() => props.removeFromCollection(id)}
          >
            {`Remove from ${props.collection}`}
          </button>}
        {/* {
            checked &&
            <input
              className="card-checkbox card-btn"
              type="checkbox"
              name="mealcardcheck"
              onChange={e => props.handleMealCheck(e, { id, title })}
              checked={checked}
            />
          } */}
      </div>
    </React.Fragment>
  );
};
MealDisplayCard.defaultProps = {
  addToCollection: null,
  removeFromCollection: null,
  // checkMeal: null,
  // handleMealCheck: null,
};
MealDisplayCard.propTypes = {
  title: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  addToCollection: PropTypes.func,
  // checkMeal: PropTypes.func,
  // handleMealCheck: PropTypes.func,
  removeFromCollection: PropTypes.func,
};
export default MealDisplayCard;

