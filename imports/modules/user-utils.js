/* eslint-disable consistent-return */

import _ from 'lodash';

export const getUserType = (currentUser) => {
  let type = null;

  if (currentUser.type) {
    type = currentUser.type;
  } else {
    type = Object.keys(currentUser.services)[0];
  }

  if (type) {
    return type === 'password' ? 'password' : type;
  }
};

export const getUserAvatar = currentUser => (
  currentUser.avatar ? currentUser.avatar : '/images/generic-user-profile.png'
);

export const getUserFirstName = (currentUser) => {
  const service = getUserType(currentUser);

  if (service) {
    switch (service) {
      case 'facebook':
        return currentUser.services[service].first_name;
      case 'google':
        return currentUser.services[service].given_name;
      case 'password':
        return (currentUser.name && currentUser.name.first) ? currentUser.name.first : 'Usuario';
      default:
        return '';
    }
  }
};

export const getUserLastName = (currentUser) => {
  const service = getUserType(currentUser);

  if (service) {
    switch (service) {
      case 'facebook':
        return currentUser.services[service].last_name;
      case 'google':
        return currentUser.services[service].family_name;
      case 'password':
        return (currentUser.name && currentUser.name.last) ? currentUser.name.last : 'Anónimo';
      default:
        return '';
    }
  }
};

export const getUserFullName = (currentUser) => {
  const service = getUserType(currentUser);
  let firstName = '';
  let lastName = '';

  if (service) {
    switch (service) {
      case 'facebook':
        return `${currentUser.services[service].first_name} ${currentUser.services[service].last_name}`;
      case 'google':
        return `${currentUser.services[service].given_name} ${currentUser.services[service].family_name}`;
      case 'password':
        firstName = (currentUser.name && currentUser.name.first) ? currentUser.name.first : 'Usuario';
        lastName = (currentUser.name && currentUser.name.last) ? currentUser.name.last : 'Anónimo';
        return `${firstName} ${lastName}`;
      default:
        return '';
    }
  }
};

export const getUserEmail = (currentUser) => {
  const service = getUserType(currentUser);

  if (service) {
    switch (service) {
      case 'facebook':
        return currentUser.services[service].email;
      case 'google':
        return currentUser.services[service].email;
      case 'password':
        return currentUser.emails[0].address;
      default:
        return '';
    }
  }
};

export const getUserRoles = currentUser => (
  _.map(currentUser.roles, (role, index) => {
    if (index !== currentUser.roles.length - 1) {
      return `${role}, `;
    }

    return `${role} `;
  })
);
