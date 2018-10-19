import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import { render } from 'react-dom';
import App from '../../client/ui/layouts/App';
import '../../client/js';

Meteor.startup(() => {
  Tracker.autorun(c => {
    if (Meteor.loggingIn() || !Roles.subscription.ready()) {
      return;
    }

    c.stop();
    Meteor.defer(() => render(<App />, document.getElementById('react-root')));
  });
});
