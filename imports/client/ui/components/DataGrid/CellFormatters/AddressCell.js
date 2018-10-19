import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

const AddressCell = ({ value }) => (
  <div>
    <div>
      {value.streetAddress}, {value.city}<br />
      {value.state}
    </div>
  </div>
);

AddressCell.propTypes = {
  value: PropTypes.object,
};

export default AddressCell;
