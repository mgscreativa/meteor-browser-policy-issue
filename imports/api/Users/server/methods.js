import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import SimpleSchema from 'simpl-schema';
import rateLimit from '../../../modules/server/rate-limit';

export const userIsEmailAvailable = new ValidatedMethod({
  name: 'users.isEmailAvailable',
  validate: new SimpleSchema({
    userEmail: { type: String },
  }).validator(),
  run(userData) {
    const { userEmail } = userData;

    try {
      const search = Accounts.findUserByEmail(userEmail);
      return search === null || search === undefined;
    } catch (exception) {
      throw new Meteor.Error('500', `[users.isEmailAvailable] ${exception}`);
    }
  },
});

rateLimit({
  methods: [userIsEmailAvailable],
  limit: 100,
  timeRange: 1000,
});
