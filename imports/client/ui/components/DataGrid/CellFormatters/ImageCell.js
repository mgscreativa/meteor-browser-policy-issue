import React from 'react';
import PropTypes from 'prop-types';

const onClickHandler = (history, match, dependentValues) => (
  history.push(`${match.url}/${dependentValues._id}`)
);

const ImageCell = ({ history, match, folder, rowHeight, value, dependentValues }) => (
  <div className="display-inline-block p-l-1 valign-middle">
    <span className="link-details-image-cell" onClick={() => onClickHandler(history, match, dependentValues)}>
      <img alt={dependentValues.name} src={`${folder}/${value}.png`} height={`${rowHeight - 5}px`} />
    </span>
  </div>
);

ImageCell.propTypes = {
  value: PropTypes.string,
  dependentValues: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  folder: PropTypes.string,
};

export default ImageCell;
