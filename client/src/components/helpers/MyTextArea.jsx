import { withFormsy, propTypes } from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

class TextArea extends React.Component {
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
        <textarea
          onChange={this.changeValue}
          value={this.props.getValue() || this.props.initialValue}
          placeholder={this.props.placeholder}
          maxLength={100}
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

TextArea.defaultProps = {
  placeholder: ''
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  ...propTypes
};

export { TextArea };

export default withFormsy(TextArea);
