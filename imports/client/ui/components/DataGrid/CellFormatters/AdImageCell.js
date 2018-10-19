import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { initializePopovers } from '../../../../../modules/client/template-utils';

class AdImageCell extends Component {
  componentDidMount() {
    initializePopovers();
  }

  componentDidUpdate() {
    initializePopovers();
  }

  render() {
    const { value, dependentValues } = this.props;

    return (
      <div className="display-inline-block m-x-auto valign-middle">
        <button
          type="button"
          className="btn btn-primary btn-xs"
          data-toggle="modal"
          data-target={`#modal-small-${dependentValues._id}`}
        >
          <span className="btn-label-icon left mdi mdi-image-search" />
          Ver
        </button>

        <div className="modal fade" id={`modal-small-${dependentValues._id}`}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
                <h4 className="modal-title">Publicidad</h4>
              </div>
              <div className="modal-body">
                <div>
                  <img src={value} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AdImageCell.propTypes = {
  value: PropTypes.string,
  dependentValues: PropTypes.object,
};

export default AdImageCell;
