import React from 'react';
import PropTypes from 'prop-types';

const TitleBar = ({ title, icon }) => (
  <div className="page-header">
    <div className="row">
      <div className="col-md-4 text-xs-center text-md-left text-nowrap">
        <h1>
          <i className={`page-header-icon ${icon}`} />
          {title}
        </h1>
      </div>
      <hr className="page-wide-block visible-xs visible-sm" />
    </div>
  </div>
);

TitleBar.defaultProps = {
  icon: null,
  title: null,
};

TitleBar.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
};

export default TitleBar;
