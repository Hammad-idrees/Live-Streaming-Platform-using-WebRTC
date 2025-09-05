const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/user.controller");
const multer = require("multer");
const path = require("path");
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");

// Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../uploads/avatars"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user ? req.user._id + ext : Date.now() + ext);
  },
});
const upload = multer({ storage });

router.post(
  "/register",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    check("age")
      .isInt({ min: 0 })
      .withMessage("Age must be a positive integer"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, data: null, error: errors.array() });
    }
    next();
  },
  userController.register
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, data: null, error: errors.array() });
    }
    next();
  },
  userController.login
);
router.get("/profile", auth, userController.getProfile);
router.put(
  "/profile",
  auth,
  upload.single("avatar"),
  userController.updateProfile
);

// Upgrade viewer to streamer
router.post("/upgrade-to-streamer", auth, userController.upgradeToStreamer);

module.exports = router;
