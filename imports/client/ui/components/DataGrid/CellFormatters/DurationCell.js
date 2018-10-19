import React from 'react';
import PropTypes from 'prop-types';
import { secondsToHMS } from '../../../../../modules/client/date-utils';

const DurationCell = ({ value }) => (
  <div>
    <div>
      {secondsToHMS(value)}
    </div>
  </div>
);

DurationCell.defaultProps = {
  value: null,
};

DurationCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default DurationCell;
