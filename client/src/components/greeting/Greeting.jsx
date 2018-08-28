import React from 'react';
import PropTypes from 'prop-types';

const Greeting = props =>
  (
    <div>
      <h4 className="greeting">
        Welcome {props.isCaterer ? 'Caterer' : 'Customer'} {props.firstName}
      </h4>
    </div>
  );
Greeting.propTypes = {
  isCaterer: PropTypes.bool.isRequired,
  firstName: PropTypes.string.isRequired
};
export default Greeting;
