const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//   to:'rick@rickglascock.com',
//   from: 'rick@rickglascock.com',
//   subject: "This is my first message",
//   text: 'Hope this message finds me well.'
// })


const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'rick@rickglascock.com',
    subject: "Welcome",
    text: `${name}, thanks for signing up.`
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'rick@rickglascock.com',
    subject: 'Sorry to see you go.',
    text: `${name}, I noticed you've cancelled your account. Let me know if you have suggestions for making this service better.\n Rick`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}