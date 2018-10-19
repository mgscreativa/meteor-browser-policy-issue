import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ButtonBar = props =>
  props.buttonsConfig && props.buttonsConfig.length ? (
    <div className="m-r-2">
      {_.map(props.buttonsConfig, (button, index, collection) => {
        let onClick = null;
        let buttonMarginRight = '';

        if (button.onClick && typeof props[button.onClick] === 'function') {
          onClick = props[button.onClick];

          /* switch (button.onClick) {
         case 'deleteSelected':
         onClick = this.deleteSelected;
         break;

         default:
         onClick = null;
         } */
        }

        if (collection.length > index + 1) {
          buttonMarginRight = 'm-r-1';
        }

        const buttonComponent = (
          <button
            key={button.caption}
            type="button"
            className={`btn btn-sm btn-${
              button.buttonClassType
            } ${buttonMarginRight}`}
            onClick={onClick}
          >
            <span className={`btn-label-icon left ${button.iconClassName}`} />
            {button.caption}
          </button>
        );

        if (button.route) {
          return (
            <Link key={button.caption} to={button.route}>
              {buttonComponent}
            </Link>
          );
        }

        return buttonComponent;
      })}
    </div>
  ) : null;

ButtonBar.propTypes = {
  buttonsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      caption: PropTypes.string,
      route: PropTypes.string,
      buttonClassType: PropTypes.string,
      onClick: PropTypes.string,
      iconClassName: PropTypes.string,
    }),
  ),
  deleteSelected: PropTypes.func,
};

export default ButtonBar;
