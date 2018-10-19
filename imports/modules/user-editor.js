/* eslint-disable no-undef */

import { Meteor } from 'meteor/meteor';
import alertBox from './client/alert-box';
import './validation';

let component;

const getUserData = () => ({
  first: document.querySelector('[name="firstName"]').value.trim(),
  last: document.querySelector('[name="lastName"]').value.trim(),
  password: {
    old: document.querySelector('[name="oldPassword"]').value.trim(),
    new: document.querySelector('[name="newPassword"]').value.trim(),
  },
});

const handleEdit = () => {
  const { toggleEdit } = component.props;
  const userData = getUserData();

  Meteor.call('users.update', userData, (error) => {
    if (error) {
      alertBox(error.reason, '', 'warning');
    } else {
      alertBox('Se actualizo su información con éxito!');

      component.userEditorForm.reset();
      toggleEdit();
    }
  });
};

const validate = () => {
  $(component.userEditorForm).validate({
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      oldPassword: {
        required: false,
      },
      newPassword: {
        required: false,
        minlength: 6,
      },
    },
    messages: {
      firstName: {
        required: 'Ingrese su nombre.',
      },
      lastName: {
        required: 'Ingrese su apellido.',
      },
      newPassword: {
        minlength: 'La contraseña debe ser de por lo menos 6 caracteres.',
      },
    },
    submitHandler() { handleEdit(); },
  });
};

export default userEditor = (options) => {
  component = options.component;
  validate();
};
