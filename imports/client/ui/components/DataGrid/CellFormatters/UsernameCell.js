import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UsernameCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: null,
    };
  }

  componentDidMount() {
    Meteor.call(
      'users.info',
      { userId: this.props.value },
      (error, userData) => {
        if (error) {
          console.log(error.reason);
        } else {
          if (!userData) {
            console.log(`No se encontro el usuario ${this.props.value}.`);
          }

          this.setState({ userData });
        }
      },
    );
  }

  render() {
    const { userData } = this.state;
    const { value, history } = this.props;

    if (!userData) {
      return null;
    }

    return (
      <div>
        <span
          className="link-details-cell"
          style={{ cursor: 'pointer' }}
          // onClick={() => history.push(`/activities/user/${value}`)}
          onClick={() => history.push(`/users/${value}`)}
        >
          {userData.name.first} {userData.name.last}
        </span>
      </div>
    );
  }
}

UsernameCell.propTypes = {
  value: PropTypes.string,
  history: PropTypes.object,
  dependentValues: PropTypes.object,
};

export default UsernameCell;
