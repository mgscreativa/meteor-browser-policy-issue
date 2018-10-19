import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import OAuthLoginButtons from '../../components/OAuthLoginButtons';
import validate from '../../../../modules/validate';
import alertBox from '../../../../modules/client/alert-box';

class Login extends Component {
  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        emailAddress: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        emailAddress: {
          required: 'Ingrese su email.',
          email: 'Ingrese un email válido',
        },
        password: {
          required: 'Ingrese su contraseña.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit = () => {
    const { history } = this.props;

    Meteor.loginWithPassword(this.emailAddress.value, this.password.value, (error) => {
      if (error) {
        alertBox(error.reason, '', 'warning');
      } else {
        alertBox('Has iniciado sesión', 'Bienvenido!');
        history.push('/');
      }
    });
  };

  render() {
    return (
      <div className="page-signin-container" id="page-signin-form">
        <h2 className="m-t-0 m-b-4 text-xs-center font-weight-semibold font-size-20">Ingrese a su Cuenta</h2>

        <form
          className="panel p-a-4 login"
          ref={form => (this.form = form)}
          onSubmit={event => event.preventDefault()}
        >

          <fieldset className="form-group form-group-lg">
            <input
              className="form-control"
              placeholder="Ingrese su Email"
              type="email"
              ref={emailAddress => (this.emailAddress = emailAddress)}
              name="emailAddress"
            />
          </fieldset>

          <fieldset className=" form-group form-group-lg">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              ref={password => (this.password = password)}
              name="password"
              autoComplete="password"
            />
          </fieldset>

          <div className="clearfix">
            <Link
              to="/recover-password"
              className="font-size-12 text-muted pull-xs-right"
              id="page-signin-forgot-link"
            >
              Olvido su contraseña?
            </Link>
          </div>

          <button type="submit" className="btn btn-block btn-lg btn-primary m-t-3">
            Ingresar
          </button>

        </form>

        {/*<OAuthLoginButtons message={'o ingrese con'} services={['facebook', 'google']} />*/}
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Login;
