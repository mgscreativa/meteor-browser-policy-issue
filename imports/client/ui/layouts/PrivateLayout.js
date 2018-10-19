import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import MenuSidebar from '../components/MenuSidebar/MenuSidebar';
import MenuTop from '../components/MenuTop/MenuTop';
import TitleBar from '../components/TitleBar/TitleBar';

const PrivateLayout = ({
  loggingIn,
  authenticated,
  appSettings,
  title,
  icon,
  component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (loggingIn) return <div />;

      return authenticated ? (
        <div className="public-layout">
          <MenuSidebar />
          <MenuTop />

          <div className="px-content">
            {title && icon ? <TitleBar title={title} icon={icon} /> : ''}
            {React.createElement(component, {
              ...props,
              loggingIn,
              authenticated,
              appSettings,
            })}
          </div>
        </div>
      ) : (
        <Redirect to="/login" />
      );
    }}
  />
);

PrivateLayout.defaultProps = {
  icon: null,
  title: null,
};

PrivateLayout.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  appSettings: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  icon: PropTypes.string,
  title: PropTypes.string,
};

export default PrivateLayout;
