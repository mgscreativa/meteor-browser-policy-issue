import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const profile = options.profile;
  const newUser = user;

  const userType = Object.keys(newUser.services)[0];

  switch (userType) {
    case 'facebook':
      newUser.type = 'facebook';
      newUser.tosAccepted = true;
      break;
    case 'google':
      newUser.type = 'google';
      newUser.tosAccepted = true;
      break;
    case 'password':
      newUser.type = 'password';
      break;
    default:
      newUser.type = 'password';
  }

  if (!options.fake && userType === 'password' && !options.tosAccepted) {
    throw new Meteor.Error('500', 'No aceptaste los términos y condiciones!');
  } else {
    newUser.tosAccepted = true;
  }

  if (!options.fake && options.email !== 'admin@admin.com') {
    newUser.roles = ['registered'];
  }

  return newUser;
});
