import nodemailer from 'nodemailer';

class Email {
  constructor(details) {
    this.message = details.message;
    this.link = details.link;
    this.linkName = details.linkName;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'development')
      return nodemailer.createTransport({
        host,
      });
  }
}
