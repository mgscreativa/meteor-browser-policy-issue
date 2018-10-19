import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MenuTop extends Component {
  render() {
    return (
      <nav className="navbar px-navbar" id="px-navbar-dinamo">
        <div className="navbar-header">
          <Link className="navbar-brand px-brand" to="/">
            <span className="px-logo m-t-0 bg-primary">
              <img alt="Logo" src="/images/logo.png" width="24" />
            </span>
            Browser Policy
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
                X<span className="hidden-md">Test</span>
              </Link>
              <ul className="dropdown-menu">
                <li>

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

export default MenuTop;
