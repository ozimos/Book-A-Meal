import { withFormsy, propTypes } from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {

    this.props.setValue(event.currentTarget.value);
  }

  render() {
    const errorMessage = this.props.getErrorMessage();

    return (
      <React.Fragment>
        <input
          style={this.props.style}
          ref={this.props.myRef}
          onChange={this.changeValue}
          type={this.props.typeOfInput}
          value={this.props.getValue() || ''}
          placeholder={this.props.placeholder}
          maxLength="100"
        />
        <div
          style={{
            color: 'red', fontSize: '1rem'
          }}
        >
          {errorMessage}
        </div>
      </React.Fragment>
    );
  }
}
Input.defaultProps = {
  placeholder: '',
};
Input.propTypes = {
  typeOfInput: PropTypes.string.isRequired,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  ...propTypes
};
export { Input };
export default withFormsy(Input);
