import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validate from '../../../../modules/validate';
import alertBox from '../../../../modules/client/alert-box';

class ResetPassword extends Component {
  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        newPassword: {
          required: true,
          minlength: 6,
        },
        repeatNewPassword: {
          required: true,
          minlength: 6,
          equalTo: '[name="newPassword"]',
        },
      },
      messages: {
        newPassword: {
          required: 'Ingrese una nueva contraseña.',
          minlength: 'La contraseña debe ser de por lo menos 6 caracteres.',
        },
        repeatNewPassword: {
          required: 'Repita su nueva contraseña.',
          equalTo: 'Las contraseñas no coinciden. Intentelo nuevamente.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit = () => {
    const { match, history } = this.props;
    const token = match.params.token;

    Accounts.resetPassword(token, this.newPassword.value, (error) => {
      if (error) {
        alertBox(error.reason, '', 'error');
      } else {
        alertBox('Contraseña actualizada!');
        history.push('/');
      }
    });
  };

  render() {
    return (
      <div className="page-signin-container" id="page-signin-form">
        <h2 className="m-t-0 m-b-4 text-xs-center font-weight-semibold font-size-20">
          Cambiar Contraseña
        </h2>

        <div className="alert alert-info alert-dark">
          Ingrese su nueva contraseña a continuación.
        </div>

        <form
          className="panel p-a-4"
          onSubmit={event => event.preventDefault()}
          ref={form => (this.form = form)}
        >

          <fieldset className=" form-group form-group-lg">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input
              className="form-control"
              placeholder="Nueva Contraseña"
              type="password"
              ref={newPassword => (this.newPassword = newPassword)}
              name="newPassword"
              autoComplete="newPassword"
            />
          </fieldset>

          <fieldset className=" form-group form-group-lg">
            <label htmlFor="newPassword">Repetir Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Repetir Contraseña"
              ref={repeatNewPassword => (this.repeatNewPassword = repeatNewPassword)}
              name="repeatNewPassword"
              autoComplete="repeatNewPassword"
            />
          </fieldset>

          <button type="submit" className="btn btn-block btn-lg btn-primary m-t-3">
            Cambiar contraseña e ingresar
          </button>

        </form>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default ResetPassword;
