import React from 'react';
import PropTypes from 'prop-types';
import { getUserEmail } from '../../../../../modules/user-utils';

const UserEmailCell = ({ value, dependentValues }) => {
  let outputValue = '';

  if (value) {
    outputValue = value[0].address;
  } else {
    const currentUser = {
      type: dependentValues.type,
      services: dependentValues.services,
    };

    outputValue = getUserEmail(currentUser);
  }

  return (
    <div>
      <div>
        {outputValue}
      </div>
    </div>
  );
};

UserEmailCell.defaultProps = {
  value: null,
  dependentValues: null,
};

UserEmailCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  dependentValues: PropTypes.object,
};

export default UserEmailCell;
