const pushService = require("../services/notification/push.service");
const emailService = require("../services/notification/email.service");
const User = require("../models/User");

// We use it after the subscribe feature
// async function sendScheduledNotifications() {
//   // Placeholder: Send notifications to all users
//   const users = await User.find();
//   for (const user of users) {
//     await pushService.sendPushNotification(
//       user._id,
//       "Reminder",
//       "Check out new streams!"
//     );
//     await emailService.sendEmailNotification(
//       user.email,
//       "Live Streaming Update",
//       "Don't miss new streams!"
//     );
//   }
// }

// Placeholder: Schedule with node-cron or similar
// const cron = require('node-cron');
// cron.schedule('0 10 * * *', sendScheduledNotifications);

module.exports = { sendScheduledNotifications };
