import React from 'react';
import PropTypes from 'prop-types';

const MealRow = ({
  id,
  title,
  price,
  quantity,
  setQuantity,
  removeFromCart
}) => {
  const subTotal = price * (quantity || 1);

  return (
    <React.Fragment>
      <tr className="slim">
        <td>{title}</td>
        <td>{price}</td>

        <td>

          <input
            type="number"
            placeholder="1"
            onChange={event => setQuantity(event, id)}
            value={quantity}
            maxLength="4"
            max="99"
            min="1"
            step="1"
          />

        </td>

        <td>{subTotal}</td>
        <td>

          <button className="btn btn-cart" onClick={() => removeFromCart(id)}>
                &#10006;
          </button>

        </td>
      </tr>
    </React.Fragment>
  );
};

MealRow.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes
    .oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  removeFromCart: PropTypes.func.isRequired,
  setQuantity: PropTypes.func.isRequired,
};
export default MealRow;
