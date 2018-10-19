import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import OAuthLoginButton from './OAuthLoginButton/index';

class OAuthLoginButtons extends Component {
  render() {
    const { services, message } = this.props;

    return (services.length ? (
      <div>
        <h4 className="m-y-3 text-xs-center font-weight-semibold text-white">{message}</h4>
        <div className="text-xs-center">
          {_.map(services, (service, index) => (
            <OAuthLoginButton
              key={service}
              service={service}
              last={(index + 1 === services.length)}
            />)
          )}
        </div>
      </div>
    ) : <div />);
  }
}

OAuthLoginButtons.propTypes = {
  services: PropTypes.array.isRequired,
  message: PropTypes.string.isRequired,
};

const verificationComplete = new ReactiveVar(false);
const verifiedServices = new ReactiveVar([]);

export default withTracker(({ services }) => {
  if (!verificationComplete.get()) {
    Meteor.call('oauth.verifyConfiguration', services, (error, response) => {
      if (error) {
        console.warn(error);
      } else {
        verifiedServices.set(response);
        verificationComplete.set(true);
      }
    });
  }

  return {
    services: verifiedServices.get(),
  };
})(OAuthLoginButtons);
