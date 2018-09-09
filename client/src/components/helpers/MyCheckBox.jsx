import { withFormsy, propTypes } from 'formsy-react';
import React from 'react';

class CheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {

    this.props.setValue(event.target.checked);
  }

  render() {

    return (
      <React.Fragment>

        <input
          style={{ visibility: 'hidden', margin: '-5px' }}
          onChange={this.changeValue}
          type="checkbox"
          value={this.props.getValue() || false}
          id="isCaterer"
          name="isCaterer"
        />

      </React.Fragment>
    );
  }
}

CheckBox.propTypes = {
  ...propTypes
};

export { CheckBox };

export default withFormsy(CheckBox);
