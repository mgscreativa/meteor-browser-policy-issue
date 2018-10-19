import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import validate from '../../../../modules/validate';
import alertBox from '../../../../modules/client/alert-box';

class RecoverPassword extends Component {
  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        emailAddress: {
          required: true,
          email: true,
        },
      },
      messages: {
        emailAddress: {
          required: 'Ingrese su email.',
          email: 'Ingrese un email válido',
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit = () => {
    const { history } = this.props;
    const email = this.emailAddress.value;

    Accounts.forgotPassword({ email }, error => {
      if (error) {
        alertBox(error.reason, '', 'warning');
      } else {
        alertBox(
          'Revise su bandeja de entrada para recibir el link de cambio de contraseña.',
        );
        history.push('/login');
      }
    });
  };

  render() {
    return (
      <div className="page-signin-container" id="page-signin-forgot-form">
        <h2 className="m-t-0 m-b-4 text-xs-center font-weight-semibold font-size-20">
          Recuperar Contraseña
        </h2>

        <div className="alert alert-info alert-dark">
          Ingrese su dirección de email para recibir un link y cambiar su
          contraseña.
        </div>

        <form
          action="index.html"
          className="panel p-a-4"
          ref={form => (this.form = form)}
          onSubmit={event => event.preventDefault()}
        >
          <fieldset className="form-group form-group-lg">
            <input
              type="email"
              className="form-control"
              placeholder="Ingrese su Email"
              ref={emailAddress => (this.emailAddress = emailAddress)}
              name="emailAddress"
            />
          </fieldset>

          <button
            type="submit"
            className="btn btn-block btn-lg btn-primary m-t-3"
          >
            Recuperar Contraseña
          </button>

          <div className="m-t-2 text-muted">
            <p>
              Recuerdas tu contraseña?&nbsp;
              <Link to="/login" id="page-signin-forgot-back">
                Ingresar
              </Link>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

RecoverPassword.propTypes = {
  history: PropTypes.object.isRequired,
};

export default RecoverPassword;
