const express = require("express");
const router = express.Router();
const searchController = require("../../../controllers/search.controller");

router.get("/vod", searchController.searchVods);

module.exports = router;
