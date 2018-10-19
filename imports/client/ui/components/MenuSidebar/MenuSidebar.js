import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routesData from '../../../../modules/client/route-utils';

const findRouteProperty = (url, property) =>
  _.find(routesData, { path: url })[property];

class MenuSidebar extends Component {
  render() {
    return (
      <nav className="px-nav px-nav-left" id="px-nav-dinamo">
        <button type="button" className="px-nav-toggle" data-toggle="px-nav">
          <span className="px-nav-toggle-arrow" />
          <span className="navbar-toggle-icon" />
          <span className="px-nav-toggle-label font-size-11">HIDE MENU</span>
        </button>

        <ul className="px-nav-content">
          <li className="px-nav-box p-a-3 b-b-1" id="demo-px-nav-box">
            X
            <div className="font-size-16">
              <span className="font-weight-light">Bienvenido, </span>
            </div>
            <div className="btn-group" style={{ marginTop: 4 }}>
              <Link
                to="/profile"
                title="Editar Cuenta"
                className="btn btn-xs btn-primary btn-outline"
              >
                <i className="mdi mdi-account" />
              </Link>
              <Link
                to=""
                className="btn btn-xs btn-danger btn-outline"
                onClick={() => Meteor.logout()}
              >
                <strong>
                  <i className="dropdown-icon mdi mdi-power" />
                </strong>
              </Link>
            </div>
          </li>

          <li className="px-nav-item">
            <Link to="/">
              <i
                className={`px-nav-icon ${findRouteProperty('/', 'icon')}`}
                aria-hidden="true"
              />
              <span className="px-nav-label">
                {findRouteProperty('/', 'title')}
              </span>
            </Link>
          </li>










        </ul>
      </nav>
    );
  }
}

export default MenuSidebar;
