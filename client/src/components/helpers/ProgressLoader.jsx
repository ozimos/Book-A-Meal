import React from 'react';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';

const ProgressLoader = props =>
  (
    <div className="progression">
      <LinearProgress
        style={{ height: '10px' }}
        variant="determinate"
        value={props.upload}
      />
    </div>
  );

ProgressLoader.propTypes = {
  upload: PropTypes.number.isRequired,
};

export default ProgressLoader;

