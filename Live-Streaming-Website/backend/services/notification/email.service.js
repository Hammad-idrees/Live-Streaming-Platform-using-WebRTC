// email.service.js
async function sendEmailNotification(email, subject, message) {
  // Placeholder: Integrate email service (e.g., nodemailer, SES)
  console.log(`Email to ${email}: ${subject} - ${message}`);
}

module.exports = { sendEmailNotification };
