import { Accounts } from 'meteor/accounts-base';
import { Facebook } from 'meteor/facebook-oauth';

const registerFacebookMobileLoginHandler = () => {
  Accounts.registerLoginHandler('facebookMobileLogin', params => {
    const data = params.facebookMobileLogin;

    if (!data) {
      return undefined;
    }

    const identity = Facebook.handleAuthFromAccessToken(
      data.accessToken,
      (+new Date()) + (1000 * data.expirationTime),
    );

    return Accounts.updateOrCreateUserFromExternalService(
      'facebook',
      {
        ...identity.serviceData,
      },
      identity.options,
    );
  });
};

export default registerFacebookMobileLoginHandler;
