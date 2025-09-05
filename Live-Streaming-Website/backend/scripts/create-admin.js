// Usage: node scripts/create-admin.js

// It creates the admin script means we don't need to create admin from the start screen and to secure our system
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "adminuser";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminPassword123";
const ADMIN_AGE = process.env.ADMIN_AGE || 30;

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("Admin user already exists:", existing.email);
    process.exit(0);
  }
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
    age: ADMIN_AGE,
  });
  console.log("Admin user created:", admin.email);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Error creating admin:", err);
  process.exit(1);
});
