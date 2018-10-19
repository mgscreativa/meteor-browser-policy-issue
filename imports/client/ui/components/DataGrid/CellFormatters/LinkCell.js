import React from 'react';
import PropTypes from 'prop-types';

const LinkCell = props => {
  const { value } = props;

  const disabled = !!value;

  return (
    <div>
      <button
        className="btn btn-warning btn-xs"
        onClick={() => window.open(`${value}`)}
        title={value}
        disabled={!disabled}
      >
        <span className="btn-label-icon left mdi mdi-bullseye-arrow" />
        Ver
      </button>
    </div>
  );
};

LinkCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string]),
};

export default LinkCell;
