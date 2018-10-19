import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

if (!Meteor.isDevelopment) {
  WebApp.connectHandlers.use((req, res, next) => {
    if (req.headers.host === 'dinamo-server-meteor.herokuapp.com') {
      res.writeHead(301, {
        Location: `https://dinamoapp.playtime.com.ar${req.originalUrl}`,
      });
      res.end();
    } else {
      next();
    }
  });
}
