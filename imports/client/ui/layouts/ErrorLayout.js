import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';

const ErrorLayout = ({ loggingIn, authenticated, appSettings, component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <div className="public-layout">

        <div className="page-404-header bg-white">
          <Link className="px-brand px-brand-lg text-default" to="/">
            <span className="px-logo m-t-0">
              <img alt=" Logo" src="/images/logo.png" width="24" />
            </span>
            Proyect
          </Link>
        </div>

        {React.createElement(component, { ...props, loggingIn, authenticated, appSettings })}

      </div>
    )}
  />
);

ErrorLayout.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  appSettings: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
};

export default ErrorLayout;
