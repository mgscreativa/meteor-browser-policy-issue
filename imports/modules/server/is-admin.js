import { Roles } from 'meteor/alanning:roles';

const isAdmin = userId => (
  Roles.userIsInRole(userId, 'admin')
);

export { isAdmin };
