import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OAuthLoginButtons from '../../components/OAuthLoginButtons';
import validate from '../../../../modules/validate';
import alertBox from '../../../../modules/client/alert-box';
import { popupWithContent } from '../../../../modules/client/dialogs';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tosChecked: false,
    };
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 6,
        },
        acceptTos: {
          required: true,
        },
      },
      messages: {
        firstName: {
          required: 'Ingrese su nombre.',
        },
        lastName: {
          required: 'Ingrese su apellido.',
        },
        emailAddress: {
          required: 'Ingrese su email.',
          email: 'Ingrese un email válido',
        },
        password: {
          required: 'Ingrese su contraseña.',
          minlength: 'La contraseña debe ser de por lo menos 6 caracteres.',
        },
        acceptTos: {
          required: 'Acepta los términos y condiciones.',
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit = () => {
    const { history } = this.props;

    Accounts.createUser(
      {
        email: this.emailAddress.value,
        password: this.password.value,
        profile: {
          name: {
            first: this.firstName.value,
            last: this.lastName.value,
          },
        },
        tosAccepted: this.acceptTos.checked,
      },
      error => {
        if (error) {
          alertBox(error.reason, '', 'error');
        } else {
          alertBox('Bienvenido!');
          history.push('/');
        }
      },
    );
  };

  handleTosCheckClick = () => {
    if (!this.state.tosChecked) {
      this.setState({
        tosChecked: true,
      });

      return;
    }

    this.setState({
      tosChecked: false,
    });
  };

  handleTosReadClick = () => {
    Meteor.call('utility.getPage', { fileName: 'terminos-de-servicio' }, (error, response) => {
      if (error) {
        console.warn(error);
      } else {
        popupWithContent(
          response,
          'Términos de servicio',
        );
      }
    });
  };

  render() {
    return (
      <div className="page-signin-container" id="page-signin-form">
        <h2 className="m-t-0 m-b-4 text-xs-center font-weight-semibold font-size-20">
          Registrese Como Usuario
        </h2>

        <form
          className="panel p-a-4"
          ref={form => (this.form = form)}
          onSubmit={event => event.preventDefault()}
        >
          <div className="row">
            <fieldset className=" form-group form-group-lg col-sm-6">
              <label htmlFor="newPassword">Nombre</label>
              <input
                className="form-control"
                placeholder="Nombre"
                type="text"
                ref={firstName => (this.firstName = firstName)}
                name="firstName"
              />
            </fieldset>

            <fieldset className=" form-group form-group-lg col-sm-6">
              <label htmlFor="newPassword">Apellido</label>
              <input
                type="text"
                className="form-control"
                placeholder="Apellido"
                ref={lastName => (this.lastName = lastName)}
                name="lastName"
              />
            </fieldset>
          </div>

          <fieldset className=" form-group form-group-lg">
            <label htmlFor="password">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Dirección de Email"
              ref={emailAddress => (this.emailAddress = emailAddress)}
              name="emailAddress"
              autoComplete="emailAddress"
            />
          </fieldset>

          <fieldset className=" form-group form-group-lg">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              ref={password => (this.password = password)}
              name="password"
              autoComplete="password"
            />
            <small className="text-muted">Al menos 6 caracteres</small>
          </fieldset>

          <fieldset className=" form-group form-group-lg custom-tos-checkbox-fieldset">
            <label
              htmlFor="acceptTos"
              className="custom-control custom-checkbox custom-tos-checkbox"
              onClick={this.handleTosCheckClick}
            >
              <input
                type="checkbox"
                checked={this.state.tosChecked}
                className="custom-control-input"
                ref={acceptTos => (this.acceptTos = acceptTos)}
                name="acceptTos"
              />
              <span className="custom-control-indicator" />
            </label>
            <div className="custom-tos-checkbox-label">Acepto los <a onClick={this.handleTosReadClick} style={{ cursor: 'pointer' }}> términos y condiciones.</a></div>
          </fieldset>

          <button
            type="submit"
            className="btn btn-block btn-lg btn-primary m-t-3"
          >
            Registrarse
          </button>

          <div className="clearfix">
            <p className="text-xs-center m-t-4">
              Ya esta registrado?&nbsp;
              <Link
                to="/login"
                className="font-size-12 text-muted text-xs-center"
                id="page-signin-forgot-link"
              >
                Ingrese
              </Link>.
            </p>
          </div>
        </form>

        <OAuthLoginButtons
          message={'o registrese con'}
          services={['facebook', 'google']}
        />
      </div>
    );
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Signup;
