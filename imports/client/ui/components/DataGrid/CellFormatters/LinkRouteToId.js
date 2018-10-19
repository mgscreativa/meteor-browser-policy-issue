import React from 'react';
import PropTypes from 'prop-types';

const LinkRouteToId = (props) => {
  const {
    value,
    history,
    route,
  } = props;

  return (
    <div>
      <span
        className="link-details-cell"
        style={{ cursor: 'pointer' }}
        onClick={() => history.push(`${route}/${value}`)}
      >
        {value}
      </span>
    </div>
  );
};

LinkRouteToId.defaultProps = {
  value: null,
};

LinkRouteToId.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  history: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
};

export default LinkRouteToId;
