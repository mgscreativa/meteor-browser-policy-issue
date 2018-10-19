import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

const RolesCell = ({ value }) => (
  <div>
    <div>
      {_.map(value, (val, index) => {
        if (index !== value.length - 1) {
          return `${val}, `;
        }

        return `${val} `;
      })}
    </div>
  </div>
);

RolesCell.defaultProps = {
  value: null,
};

RolesCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
};

export default RolesCell;
