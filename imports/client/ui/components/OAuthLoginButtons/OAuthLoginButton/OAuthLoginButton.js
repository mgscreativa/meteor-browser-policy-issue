import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { capitalize } from '@cleverbeagle/strings';
import alertBox from '../../../../../modules/client/alert-box';

import Icon from '../../Icon/index';

const {
  debug,
} = Meteor.settings.public;

const handleLogin = (service, callback) => {
  const options = {
    facebook: {
      requestPermissions: ['email'],
      loginStyle: 'popup',
    },
    google: {
      requestPermissions: ['email'],
      requestOfflineToken: true,
      loginStyle: 'popup',
    },
  }[service];

  return {
    facebook: Meteor.loginWithFacebook,
    google: Meteor.loginWithGoogle,
  }[service](options, callback);
};

const serviceLabel = {
  facebook: <Icon icon="facebook" />,
  google: <Icon icon="google" />,
};

const OAuthLoginButton = ({ service, callback, last }) => (
  <Link
    className={`page-signin-social-btn btn btn-success btn-rounded page-signin-social-btn-${service} ${last ? '' : 'm-r-2'}`}
    data-toggle="tooltip"
    title={capitalize(service)}
    to="/"
    onClick={() => handleLogin(service, callback)}
  >
    {serviceLabel[service]}
  </Link>
);

OAuthLoginButton.defaultProps = {
  callback: (error) => {
    if (error) {
      if (debug) { console.log('[OAuthLoginButton Error]:', error); }
      alertBox('No has iniciado sesión', '', 'warning');
      return;
    }

    alertBox('Has iniciado sesión', 'Bienvenido!');
  },
};

OAuthLoginButton.propTypes = {
  service: PropTypes.string.isRequired,
  callback: PropTypes.func,
  last: PropTypes.bool.isRequired,
};

export default OAuthLoginButton;
