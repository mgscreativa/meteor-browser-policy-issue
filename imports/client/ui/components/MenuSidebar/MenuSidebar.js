import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUserAvatar, getUserFirstName } from '../../../../modules/user-utils';
import { authorizeAccess } from '../../../../modules/client/authorize-utils';
import routesData from '../../../../modules/client/route-utils';
import { initializePxNav } from '../../../../modules/client/template-utils';

const findRouteProperty = (url, property) => (
  _.find(routesData, { path: url })[property]
);

class MenuSidebar extends Component {
  componentDidMount() {
    initializePxNav('#px-nav-dinamo');
  }

  componentDidUpdate() {
    initializePxNav('#px-nav-dinamo');
  }

  render() {
    const {
      ready,
      currentUser,
    } = this.props;

    if (!ready) { return <div />; }

    return (
      <nav className="px-nav px-nav-left" id="px-nav-dinamo">
        <button type="button" className="px-nav-toggle" data-toggle="px-nav">
          <span className="px-nav-toggle-arrow" />
          <span className="navbar-toggle-icon" />
          <span className="px-nav-toggle-label font-size-11">HIDE MENU</span>
        </button>

        <ul className="px-nav-content">
          <li className="px-nav-box p-a-3 b-b-1" id="demo-px-nav-box">
            <img
              src={getUserAvatar(currentUser)}
              alt=""
              className="pull-xs-left m-r-2 border-round"
              style={{ width: 54, height: 54 }}
            />

            <div className="font-size-16">
              <span className="font-weight-light">Bienvenido, </span><strong>{getUserFirstName(currentUser)}</strong>
            </div>

            <div className="btn-group" style={{ marginTop: 4 }}>
              <Link to="/profile" title="Editar Cuenta" className="btn btn-xs btn-primary btn-outline">
                <i className="mdi mdi-account" />
              </Link>
              <Link
                to=""
                className="btn btn-xs btn-danger btn-outline"
                onClick={() => Meteor.logout()}
              >
                <strong><i className="dropdown-icon mdi mdi-power" /></strong>
              </Link>
            </div>
          </li>

          <li className="px-nav-item">
            <Link to="/">
              <i className={`px-nav-icon ${findRouteProperty('/', 'icon')}`} aria-hidden="true" />
              <span className="px-nav-label">{findRouteProperty('/', 'title')}</span>
            </Link>
          </li>

          {/*{*/}
            {/*authorizeAccess(currentUser, false) ? (*/}
              {/*<li className="px-nav-item px-nav-dropdown">*/}
                {/*<Link to="">*/}
                  {/*<i className="px-nav-icon mdi mdi-cogs" />*/}
                  {/*<span className="px-nav-label">Administración</span>*/}
                {/*</Link>*/}

                {/*<ul className="px-nav-dropdown-menu">*/}

                  {/*<li className="px-nav-item">*/}
                    {/*<Link to="/users">*/}
                      {/*<i className={`px-nav-icon ${findRouteProperty('/users', 'icon')}`} aria-hidden="true" />*/}
                      {/*<span className="px-nav-label">{findRouteProperty('/users', 'title')}</span>*/}
                    {/*</Link>*/}
                  {/*</li>*/}

                  {/*<li className="px-nav-item">*/}
                    {/*<Link to="/devices">*/}
                      {/*<i className={`px-nav-icon ${findRouteProperty('/devices', 'icon')}`} aria-hidden="true" />*/}
                      {/*<span className="px-nav-label">{findRouteProperty('/devices', 'title')}</span>*/}
                    {/*</Link>*/}
                  {/*</li>*/}

                {/*</ul>*/}
              {/*</li>*/}
            {/*) : ('')*/}
          {/*}*/}

          {
            authorizeAccess(currentUser, false) ? (
              <li className="px-nav-item">
                <Link to="/routines">
                  <i className={`px-nav-icon ${findRouteProperty('/routines', 'icon')}`} aria-hidden="true" />
                  <span className="px-nav-label">{findRouteProperty('/routines', 'title')}</span>
                </Link>
              </li>
            ) : ('')
          }

          {
            authorizeAccess(currentUser, false) ? (
              <li className="px-nav-item">
                <Link to="/devices">
                  <i className={`px-nav-icon ${findRouteProperty('/devices', 'icon')}`} aria-hidden="true" />
                  <span className="px-nav-label">{findRouteProperty('/devices', 'title')}</span>
                </Link>
              </li>
            ) : ('')
          }

          {
            authorizeAccess(currentUser, false) ? (
              <li className="px-nav-item">
                <Link to="/parks">
                  <i className={`px-nav-icon ${findRouteProperty('/parks', 'icon')}`} aria-hidden="true" />
                  <span className="px-nav-label">{findRouteProperty('/parks', 'title')}</span>
                </Link>
              </li>
            ) : ('')
          }

          <li className="px-nav-item">
            <Link to="/activities">
              <i className={`px-nav-icon ${findRouteProperty('/activities', 'icon')}`} aria-hidden="true" />
              <span className="px-nav-label">{findRouteProperty('/activities', 'title')}</span>
            </Link>
          </li>

          {
            authorizeAccess(currentUser, false) ? (
              <li className="px-nav-item">
                <Link to="/ads">
                  <i className={`px-nav-icon ${findRouteProperty('/ads', 'icon')}`} aria-hidden="true" />
                  <span className="px-nav-label">{findRouteProperty('/ads', 'title')}</span>
                </Link>
              </li>
            ) : ('')
          }

          {
            authorizeAccess(currentUser, false) ? (
              <li className="px-nav-item">
                <Link to="/reports">
                  <i className={`px-nav-icon ${findRouteProperty('/reports', 'icon')}`} aria-hidden="true" />
                  <span className="px-nav-label">{findRouteProperty('/reports', 'title')}</span>
                </Link>
              </li>
            ) : ('')
          }

          {
            authorizeAccess(currentUser, false) ? (
              <li className="px-nav-item">
                <Link to="/users">
                  <i className={`px-nav-icon ${findRouteProperty('/users', 'icon')}`} aria-hidden="true" />
                  <span className="px-nav-label">{findRouteProperty('/users', 'title')}</span>
                </Link>
              </li>
            ) : ('')
          }

          <li className="px-nav-item">
            <Link to="/profile">
              <i className={`px-nav-icon ${findRouteProperty('/profile', 'icon')}`} aria-hidden="true" />
              <span className="px-nav-label">{findRouteProperty('/profile', 'title')}</span>
            </Link>
          </li>

        </ul>
      </nav>
    );
  }
}

MenuSidebar.propTypes = {
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.info');

  return {
    ready: subscription.ready(),
    currentUser: Meteor.user(),
  };
})(MenuSidebar);
