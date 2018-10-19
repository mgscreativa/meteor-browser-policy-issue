import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ icon }) => (<i className={`mdi mdi-${icon}`} />);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default Icon;
