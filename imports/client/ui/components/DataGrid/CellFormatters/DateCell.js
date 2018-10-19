import React from 'react';
import PropTypes from 'prop-types';
import { dayMonthYearWithHours } from '../../../../../modules/client/date-utils';

const DateCell = ({ value }) => (
  <div>
    <div>
      {dayMonthYearWithHours(value)}
    </div>
  </div>
);

DateCell.defaultProps = {
  value: null,
};

DateCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};

export default DateCell;
