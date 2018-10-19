import React from 'react';
import PropTypes from 'prop-types';

const ParkCell = ({ value }) => (
  <div className="display-inline-block p-l-1 valign-middle">
    <div>{value.name}</div>
  </div>
);

ParkCell.defaultProps = {
  value: null,
};

ParkCell.propTypes = {
  value: PropTypes.object,
};

export default ParkCell;
