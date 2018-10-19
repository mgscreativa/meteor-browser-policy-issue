import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { OAuth } from 'meteor/oauth';
import { HTTP } from 'meteor/http';

const hasOwn = Object.prototype.hasOwnProperty;

const whitelistedFields = [
  'id',
  'email',
  'verified_email',
  'name',
  'given_name',
  'family_name',
  'picture',
  'locale',
  'timezone',
  'gender',
];

const getTokens = query => {
  const config = ServiceConfiguration.configurations.findOne({
    service: 'google',
  });

  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  const redirectUri = Meteor.isDevelopment
    ? config.developmentMobileRedirectUri
    : config.productionMobileRedirectUri;

  let response;

  try {
    response = HTTP.post('https://accounts.google.com/o/oauth2/token', {
      params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    });
  } catch (err) {
    throw Object.assign(
      new Error(
        `Failed to complete OAuth handshake with Google. ${err.message}`,
      ),
      { response: err.response },
    );
  }

  if (response.data.error) {
    throw new Error(
      `Failed to complete OAuth handshake with Google. ${response.data.error}`,
    );
  } else {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      idToken: response.data.id_token,
    };
  }
};

const getIdentity = accessToken => {
  try {
    return HTTP.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: { access_token: accessToken },
    }).data;
  } catch (err) {
    throw Object.assign(
      new Error(`Failed to fetch identity from Google. ${err.message}`),
      { response: err.response },
    );
  }
};

const getScopes = accessToken => {
  try {
    return HTTP.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
      params: { access_token: accessToken },
    }).data.scope.split(' ');
  } catch (err) {
    throw Object.assign(
      new Error(`Failed to fetch tokeninfo from Google. ${err.message}`),
      { response: err.response },
    );
  }
};

const getServiceDataFromTokens = tokens => {
  const accessToken = tokens.accessToken;
  const idToken = tokens.idToken;
  const scopes = getScopes(accessToken);
  const identity = getIdentity(accessToken);
  const serviceData = {
    accessToken,
    idToken,
    scope: scopes,
  };

  if (hasOwn.call(tokens, 'expiresAt')) {
    serviceData.expiresAt = Date.now() + 1000 * parseInt(tokens.expiresIn, 10);
    serviceData.expiresAt1 =
      +new Date() + 1000 * parseInt(tokens.expiresIn, 10);
  }

  const fields = Object.create(null);
  whitelistedFields.forEach(name => {
    if (hasOwn.call(identity, name)) {
      fields[name] = identity[name];
    }
  });

  Object.assign(serviceData, fields);

  if (tokens.refreshToken) {
    serviceData.refreshToken = tokens.refreshToken;
  }

  return {
    serviceData,
    options: {
      profile: {
        name: identity.name,
      },
    },
  };
};

const validIdToken = idToken => {
  const config = ServiceConfiguration.configurations.findOne({
    service: 'google',
  });

  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  try {
    const result = HTTP.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
      params: { id_token: idToken },
    });

    if (result && result.statusCode === 200) {
      return _.contains(config.validClientIds, result.data.issued_to);
    }
    return false;
  } catch (err) {
    throw Object.assign(
      new Error(
        `[idToken] Failed to fetch tokeninfo from Google. ${err.message}`,
      ),
      { response: err.response },
    );
  }
};

const registerGoogleMobileLoginHandler = () => {
  Accounts.registerLoginHandler('googleMobileLogin', params => {
    const data = params.googleMobileLogin;

    if (!data) {
      return undefined;
    }

    let tokens = null;

    if (data.serverAuthCode) {
      tokens = getTokens({
        code: data.serverAuthCode,
      });
    } else {
      throw new ServiceConfiguration.ConfigError();
    }

    if (!validIdToken(tokens.idToken)) {
      throw Object.assign(new Error('Failed to verify client with Google.'), {
        response: tokens.accessToken,
      });
    }

    const result = getServiceDataFromTokens(tokens);

    return Accounts.updateOrCreateUserFromExternalService(
      'google',
      {
        accessToken: tokens.accessToken,
        idToken: tokens.idToken,
        scope: result.serviceData.scope,
        id: result.serviceData.id,
        email: result.serviceData.email,
        verified_email: result.serviceData.verified_email,
        name: result.serviceData.name,
        given_name: result.serviceData.given_name,
        family_name: result.serviceData.family_name,
        picture: result.serviceData.picture,
        gender: result.serviceData.gender,
      },
      result.options,
    );
  });
};

export default registerGoogleMobileLoginHandler;
