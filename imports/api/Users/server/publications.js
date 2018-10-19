import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { publishPagination } from 'meteor/kurounin:pagination';
import { Roles } from 'meteor/alanning:roles';

publishPagination(Meteor.users, { name: 'users.paginatedList' });

Meteor.publish('users.roles', () => Roles.getAllRoles());
