import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStateIcon } from '../../../../../modules/client/icon-utils';
import {
  getStateColor,
  translateState,
} from '../../../../../modules/client/general-utils';
import alertBox from '../../../../../modules/client/alert-box';

class StateCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  onStateClickHandler = () => {
    this.setState({ loading: !this.state.loading });

    const { value, dependentValues, methodToCall } = this.props;
    const newState = value === 1 ? 0 : 1;
    const document = _.omitBy(dependentValues, (value, key) =>
      _.includes(key, 'sub_'),
    );

    Meteor.call(methodToCall, { ...document, state: newState }, error => {
      if (error) {
        alertBox(error.reason, '', 'warning');
      } else {
        this.setState({ loading: !this.state.loading });
      }
    });
  };

  render() {
    const { value } = this.props;

    if (this.state.loading) {
      return <i className="page-header-icon mdi mdi-loading mdi-spin" />;
    }

    return (
      <div>
        <span
          style={{ cursor: 'pointer', color: getStateColor(value) }}
          onClick={this.onStateClickHandler}
          title={translateState(value)}
        >
          <i className={`page-header-icon mdi mdi-${getStateIcon(value)}`} />
        </span>
      </div>
    );
  }
}

StateCell.propTypes = {
  value: PropTypes.number,
  dependentValues: PropTypes.object,
  methodToCall: PropTypes.string,
};

export default StateCell;
