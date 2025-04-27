import nodemailer from 'nodemailer';
import ejs from 'ejs';

class Email {
  constructor(emailData) {
    this.message = emailData.message;
    this.link = emailData.link;
    this.linkName = emailData.linkName;
    this.postDescription = emailData.postDescription;
    this.toEmail = emailData.user.email;
    this.fullName = emailData.user.name;
    this.subject = emailData.subject;
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

  async send(template) {
    // const template = ejs.render('<file-template-name>', {dynamic-values-object-like-links-and-stuff});

    const data = {
      fullName: this.fullName,
      message: this.message,
      link: this.link,
      linkText: this.linkName,
      postDescription: this.postDescription,
    };

    const mailOptions = {
      from: 'support@cardstream.com',
      to: this.toEmail,
      subject: this.subject,
      text: this.message,
    };

    await this.newTransporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    //set the template and send the email for welcoming user
    //await this.send(<template-name>, <subject>)
  }
  async sendPasswordReset() {
    //set the template and send the email for sending the password reset link
    //await this.send(<template-name>, <subject>)
  }
  async sendLoginWarning() {
    //set the template and send the email for sending the login warning
    //await this.send(<template-name>, <subject>)
  }
  async sendPasswordChangeWarning() {
    //set the template and send the email for password change warning
    //await this.send(<template-name>, <subject>)
  }
}
