import React from 'react';
import PropTypes from 'prop-types';

const onClickHandler = (history, match, id) =>
  history.push(`${match.url}/${id}`);

const LinkDetailsCell = props => {
  const {
    value,
    cellType,
    history,
    match,
    dependentValues,
    overrideValue,
  } = props;

  let outputValue = overrideValue ? dependentValues.value : value;

  if (cellType) {
    switch (cellType) {
      case 'userName':
        outputValue = `${value.first} ${value.last}`;
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <span
        className="link-details-cell"
        onClick={() => onClickHandler(history, match, dependentValues._id)}
      >
        {outputValue}
      </span>
    </div>
  );
};

LinkDetailsCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  cellType: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dependentValues: PropTypes.object,
  overrideValue: PropTypes.bool,
};

export default LinkDetailsCell;
