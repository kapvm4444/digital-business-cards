const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('node:path');

class Email {
  constructor(emailData) {
    this.toEmail = emailData.user.email;
    this.fullName = emailData.user.name;
    if (emailData.location) this.location = emailData.location;
    if (emailData.link) this.link = emailData.link;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'development')
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST_DEV,
        port: process.env.EMAIL_PORT_DEV,
        auth: {
          user: process.env.EMAIL_USERNAME_DEV,
          pass: process.env.EMAIL_PASSWORD_DEV,
        },
      });

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST_PROD,
      port: process.env.EMAIL_PORT_PROD,
      auth: {
        user: process.env.EMAIL_USERNAME_PROD,
        pass: process.env.EMAIL_PASSWORD_PROD,
      },
    });
  }

  async send(subject, data) {
    let html = await ejs.renderFile(
      path.join(__dirname, '/../email-views', 'email.ejs'),
      data,
    );

    const mailOptions = {
      from: 'support@cardstream.com',
      to: this.toEmail,
      subject,
      html,
    };

    await this.newTransporter().sendMail(mailOptions);
  }

  //set the template and send the email for welcoming user
  async sendWelcome() {
    //set the data for rendering the ejs file (dynamic content of ejs)
    const data = {
      fullName: this.fullName,
      message:
        'Welcome to the CardStream, This is a digital way of keeping your cards',
      link: this.link,
      linkText: 'Start Using',
      postDescription: 'Upload your first card and get started',
    };

    await this.send('Welcome to the CardStream', data);
  }

  //set the template and send the email for sending the password reset link
  async sendPasswordReset() {
    const data = {
      fullName: this.fullName,
      message:
        'Looks like you have forgot your password, here is the password reset link 🔗',
      link: this.link,
      linkText: 'Reset Password',
      postDescription:
        'This link will be valid for next 24 Hours! Make sure you reset it before that',
    };

    await this.send('Password Reset Link', data);
  }

  //set the template and send the email for sending the login warning
  async sendLoginWarning() {
    const data = {
      fullName: this.fullName,
      message: `You are just logged in to CardStream, If this is not you 😨 reset your password now!<br>
      Near: ${this.location.city}, ${this.location.region}, ${this.location.country} [Timezone: ${this.location.timezone}]`,
      link: this.link,
      linkText: 'Reset Password',
      postDescription: 'If this is you, just ignore this email 😊.',
      location: this.location,
    };

    await this.send('Login Warning', data);
  }

  //set the template and send the email for password change warning
  async sendPasswordChangeWarning() {
    const data = {
      fullName: this.fullName,
      message:
        'Your password is just reset, make sure you write it down 📝 and do not forgot next time! 😉',
      link: `${process.env.DOMAIN}/login`,
      linkText: 'Login',
      postDescription: `If this is not you 😦, Reset your password now.<br> ${this.link}`,
      location: this.location,
    };

    await this.send('Your password is reset', data);
  }
}

module.exports = Email;
