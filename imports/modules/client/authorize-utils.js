import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import alertBox from './alert-box';

const authorizeAccess = (currentUser, displayAlert = false) => {
  if (!Roles.userIsInRole(currentUser, ['admin'])) {
    if (displayAlert) {
      alertBox(
        'No estas autorizado a acceder a este recurso',
        'Prohibido!',
        'warning',
      );
    }

    return false;
  }

  return true;
};

export { authorizeAccess };
