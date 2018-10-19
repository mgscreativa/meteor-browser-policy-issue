import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
class PublicLayout extends Component {
  render() {
    const {
      loggingIn,
      authenticated,
      appSettings,
      component,
      hideRegister,
      ...rest
    } = this.props;

    return (
      <Route
        {...rest}
        render={props => {
          if (loggingIn) return <div />;

          return !authenticated ? (
            <div className="public-layout">
              <div className="page-signin-header p-a-2 text-sm-center bg-white">
                <Link className="px-brand px-brand-lg text-default" to="/">
                  <span className="px-logo m-t-0">
                    <img alt="Logo" src="/images/logo.png" width="24" />
                  </span>
                  Proyect
                </Link>
              </div>

              {React.createElement(component, {
                ...props,
                loggingIn,
                authenticated,
                appSettings,
              })}
            </div>
          ) : (
            <Redirect to="/" />
          );
        }}
      />
    );
  }
}

PublicLayout.defaultProps = {
  hideRegister: false,
};

PublicLayout.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  appSettings: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  hideRegister: PropTypes.bool,
};

export default PublicLayout;
