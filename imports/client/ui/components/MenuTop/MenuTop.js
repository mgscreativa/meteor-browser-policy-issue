import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUserAvatar, getUserFullName } from '../../../../modules/user-utils';
import { initializePxNavbar } from '../../../../modules/client/template-utils';

class MenuTop extends Component {
  componentDidMount() {
    initializePxNavbar('#px-navbar-dinamo');
  }

  componentDidUpdate() {
    initializePxNavbar('#px-navbar-dinamo');
  }

  render() {
    const { ready, currentUser } = this.props;

    if (!ready) {
      return <div />;
    }

    return (
      <nav className="navbar px-navbar" id="px-navbar-dinamo">
        <div className="navbar-header">
          <Link className="navbar-brand px-brand" to="/">
            <span className="px-logo m-t-0 bg-primary">
              <img alt="Dinamo Logo" src="/images/logo.png" width="24" />
            </span>
            Proyecto Dinamo
          </Link>
        </div>

        <button
          type="button"
          className="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#px-demo-navbar-collapse"
          aria-expanded="false"
        >
          <i className="navbar-toggle-icon" />
        </button>

        <div className="collapse navbar-collapse" id="px-demo-navbar-collapse">
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <Link
                to=""
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={getUserAvatar(currentUser)}
                  alt=""
                  className="px-navbar-image"
                />
                <span className="hidden-md">
                  {getUserFullName(currentUser)}
                </span>
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profile">
                    <i className="dropdown-icon mdi mdi-account" />
                    &nbsp;&nbsp;Ver Perfil
                  </Link>
                </li>
                <li className="divider" />
                <li>
                  <Link to="/" onClick={() => Meteor.logout()}>
                    <strong>
                      <i className="dropdown-icon mdi mdi-power" />
                    </strong>
                    &nbsp;&nbsp;Log Out
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

MenuTop.propTypes = {
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.info');

  return {
    ready: subscription.ready(),
    currentUser: Meteor.user(),
  };
})(MenuTop);
