import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const name = Meteor.settings.public.appName;
const email = Meteor.settings.public.appGeneralEmail;
const from = `${name} ${email}`;
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Recuperar Contraseña`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');

    if (Meteor.isDevelopment) {
      console.info(`Reset Password Link: ${urlWithoutHash}`);
    }

    return (
      `Se ha solicitado un restablecimiento de contraseña para la cuenta relacionada con esta dirección ` +
      `(${userEmail}).\n\nPara restablecer la contraseña, visite el siguiente enlace: ${urlWithoutHash}\n\n` +
      `Si no solicitó este restablecimiento, ignore este correo electrónico. Si siente que algo está mal,` +
      ` contáctese con nuestro equipo de soporte: ${email}.`
    );
  },
};
