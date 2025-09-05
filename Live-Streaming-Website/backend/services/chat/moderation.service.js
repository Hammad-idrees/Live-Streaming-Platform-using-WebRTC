// moderation.service.js
async function moderateMessage(message) {
  // Placeholder: Integrate AI moderation here
  // Return true if message is clean, false if flagged
  return !/badword|spam/i.test(message);
}

module.exports = { moderateMessage };
