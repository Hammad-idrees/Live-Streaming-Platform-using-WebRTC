// // routes/upload.routes.js
// const express = require("express");
// const router = express.Router();
// const auth = require("../../../middleware/auth");
// const uploadController = require("../../../controllers/upload.controller");

// // POST route for video upload
// router.post(
//   "/video",
//   auth,
//   uploadController.upload.single("video"),
//   uploadController.uploadAndConvert
// );

// module.exports = router;

// routes/upload.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const {
  upload,
  uploadAndConvert,
} = require("../../../controllers/upload.controller");

router.post("/video", auth, upload.single("video"), uploadAndConvert);

module.exports = router;
