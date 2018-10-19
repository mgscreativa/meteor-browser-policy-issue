import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

import registerFacebookMobileLoginHandler from './custom-login-handlers/facebook-mobile-login-handler';
import registerGoogleMobileLoginHandler from './custom-login-handlers/google-mobile-login-handler';

const OAuthSettings = Meteor.settings.private.OAuth;

if (OAuthSettings) {
  Object.keys(OAuthSettings).forEach(service => {
    ServiceConfiguration.configurations.upsert(
      { service },
      { $set: OAuthSettings[service] },
    );

    if (service === 'facebook') {
      registerFacebookMobileLoginHandler();
    } else if (service === 'google') {
      registerGoogleMobileLoginHandler();
    }
  });
}
