const mongoose = require("mongoose");
const config = require("../config/env");
const User = require("../models/User");

async function migrate() {
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // Change after first login
      role: "admin",
    });
    console.log("Admin user created: admin@example.com / admin123");
  } else {
    console.log("Admin user already exists.");
  }
  mongoose.disconnect();
}

migrate();
