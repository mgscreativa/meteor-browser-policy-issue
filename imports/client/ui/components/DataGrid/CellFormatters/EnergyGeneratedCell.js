import React from 'react';
import PropTypes from 'prop-types';

const EnergyGeneratedCell = ({ value }) => (
  <div>
    <div>
      {value} kWh
    </div>
  </div>
);

EnergyGeneratedCell.defaultProps = {
  value: null,
};

EnergyGeneratedCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default EnergyGeneratedCell;
