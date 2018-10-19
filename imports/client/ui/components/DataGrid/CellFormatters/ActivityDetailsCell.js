import React from 'react';
import PropTypes from 'prop-types';

const onClickHandler = (history, match, dependentValues) => (
  history.push(`${match.url}/${dependentValues._id}`)
);

const ActivityDetailsCell = (props) => {
  const {
    value,
    cellType,
    history,
    match,
    dependentValues,
  } = props;

  return (
    <div>
      <span className="link-details-cell" onClick={() => onClickHandler(history, match, dependentValues)} >
        {value.name}
      </span>
    </div>
  );
};

ActivityDetailsCell.defaultProps = {
  value: null,
  cellType: null,
  dependentValues: null,
};

ActivityDetailsCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  cellType: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dependentValues: PropTypes.object,
};

export default ActivityDetailsCell;
