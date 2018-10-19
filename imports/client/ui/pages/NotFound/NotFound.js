import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = props => (
  <div className="page-404-bg bg-warning NotFound">
    <h1 className="page-404-error-code"><strong>404</strong></h1>
    <h2 className="page-404-subheader">UPS!</h2>
    <h3 className="page-404-text">
      La página { window.location.pathname } no existe.
      {console.log(props)}
    </h3>
    <div className="text-sm-center">
      <Link className="btn btn-lg btn-primary" to="/">
        Volver a la página principal
      </Link>
    </div>
  </div>
);

export default NotFound;
