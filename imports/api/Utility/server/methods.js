import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import rateLimit from '../../../modules/server/rate-limit';
import getPrivateFile from '../../../modules/server/get-private-file';
import parseMarkdown from '../../../modules/parse-markdown';

export const utilityGetPage = new ValidatedMethod({
  name: 'utility.getPage',
  validate: new SimpleSchema({
    fileName: { type: String },
  }).validator(),
  run(document) {
    try {
      return parseMarkdown(getPrivateFile(`pages/${document.fileName}.md`));
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [utilityGetPage],
  limit: 5,
  timeRange: 1000,
});
