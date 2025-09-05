// validators.js
function validateUser({ username, email, password }) {
  if (!username || !email || !password) return "All fields are required.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Invalid email.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

function validateStream({ title, streamKey }) {
  if (!title || !streamKey) return "Title and stream key are required.";
  return null;
}

module.exports = { validateUser, validateStream };
