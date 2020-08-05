const sgMail = require('@sendgrid/mail');

const sendgridApiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridApiKey)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'lucasnascimento95@gmail.com',
    subject: `Welcome to the service ${name}`,
    text: `Hello ${name}, welcome to the task-manager app.`
  })
  console.log(`Welcome email sent to ${email}`);
};

const goodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'lucasnascimento95@gmail.com',
    subject: `Hi ${name}, we're sorry to see you go`,
    text: `Let us now if there's anything we could do differently to keep you on`
  })
  console.log(`Goodbye email sent to ${email}`);
};

module.exports = {
  sendWelcomeEmail,
  goodbyeEmail
}
