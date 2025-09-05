// Example in backend/routes/api/v1/constants.routes.js
const express = require("express");
const router = express.Router();
const categories = require("../../../constants/categories"); // <-- Corrected path

router.get("/categories", (req, res) => {
  res.json(categories);
});

module.exports = router;
