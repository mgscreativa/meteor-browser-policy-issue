import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from '../../redux/reducers';

import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import ErrorLayout from './ErrorLayout';

import NotFound from '../pages/NotFound';
import routesData from '../../../modules/client/route-utils';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

const App = props => (
  <Provider store={store} >
    <Router>
      <div className="App route-container">
        <Switch>
          {
            _.map(routesData, (routeData) => {
              if (routeData.private) {
                return (
                  <PrivateLayout
                    key={routeData.path}
                    exact
                    path={routeData.path}
                    component={routeData.component}
                    icon={routeData.icon}
                    title={routeData.title}
                    {...props}
                  />
                );
              }

              return (
                <PublicLayout
                  key={routeData.path}
                  path={routeData.path}
                  component={routeData.component}
                  hideRegister={routeData.hideRegister}
                  {...props}
                />
              );
            })
          }

          <ErrorLayout component={NotFound} {...props} />

        </Switch>
      </div>
    </Router>
  </Provider>
);

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;
  const appSettings = Meteor.settings.public;

  return {
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    appSettings,
  };
})(App);
