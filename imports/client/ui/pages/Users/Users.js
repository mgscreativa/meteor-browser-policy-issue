import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DataGrid,
  LinkDetailsCell,
  UserEmailCell,
  DateCell,
  RolesCell,
} from '../../components/DataGrid';
import { authorizeAccess } from '../../../../modules/client/authorize-utils';

class Users extends Component {
  constructor(props) {
    super(props);

    const { appSettings, history, match } = props;

    if (this.checkAccess()) {
      this.pagination = new Meteor.Pagination(Meteor.users, {
        name: 'users.paginatedList',
        filters: {},
        sort: { 'name.last': 1, 'name.first': 1 },
        perPage: 10,
        reactive: false,
        debug: appSettings.debug,
      });

      this.columns = [
        {
          key: 'name',
          name: 'Nombre Completo',
          formatter: (
            <LinkDetailsCell
              cellType="userName"
              history={history}
              match={match}
            />
          ),
          getRowMetaData: row => ({ _id: row._id }),
          sortable: true,
          cellClass: 'react-grid-name-HeaderCell',
        },
        {
          key: 'roles',
          name: 'Permisos',
          formatter: <RolesCell />,
          sortable: true,
          cellClass: 'react-grid-email-HeaderCell',
        },
        {
          key: 'emails',
          name: 'e-Mail',
          formatter: <UserEmailCell />,
          getRowMetaData: row => ({ type: row.type, services: row.services }),
          cellClass: 'react-grid-email-HeaderCell',
        },
        {
          key: 'createdAt',
          name: 'Creado',
          formatter: <DateCell />,
          cellClass: 'updated-at-cell',
        },
      ];

      this.buttonsConfig = [
        {
          caption: 'Nuevo',
          route: '/users/new',
          buttonClassType: 'success',
          iconClassName: 'mdi mdi-plus-circle',
          displayIfEmpty: true,
        },
        {
          caption: 'Borrar',
          onClick: 'deleteSelected',
          buttonClassType: 'danger',
          iconClassName: 'mdi mdi-delete',
        },
      ];
    }
  }

  componentWillMount() {
    this.checkAccess();
  }

  componentDidUpdate() {
    this.checkAccess();
  }

  checkAccess = () => {
    if (!authorizeAccess(Meteor.user(), true)) {
      this.props.history.push('/');
    }

    return true;
  };

  searchFilter = searchTerm => ({
    $or: [
      { 'name.first': { $regex: searchTerm, $options: 'i' } },
      { 'name.last': { $regex: searchTerm, $options: 'i' } },
    ],
  });

  render() {
    const { pagination, searchFilter, columns, buttonsConfig } = this;

    return (
      <div className="data-grid-container">
        <DataGrid
          match={this.props.match}
          history={this.props.history}
          pagination={pagination}
          columns={columns}
          searchFilter={searchFilter}
          searchField="name"
          buttonsConfig={buttonsConfig}
        />
      </div>
    );
  }
}

Users.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  appSettings: PropTypes.object.isRequired,
};

export default Users;
