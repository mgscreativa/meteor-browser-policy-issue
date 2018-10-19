import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

if (!Meteor.isDevelopment) {
  WebApp.connectHandlers.use((req, res, next) => {
    if (req.headers.host === 'https://meteor-with-browser-policy.herokuapp.com') {
      res.writeHead(301, {
        Location: `https://meteor-with-browser-policy.mgscreativa.com/${req.originalUrl}`,
      });
      res.end();
    } else {
      next();
    }
  });
}
