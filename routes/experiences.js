const express = require("express");
const router = express.Router();
const ExperienceController = require("../controllers/Experience");

const dao = require("../models/Experience");

router.post("/", ExperienceController.store);
router.get("/:id", ExperienceController.show);
router.get("/user/:id", ExperienceController.listByUserId);
// router.delete("/:id", ExperienceController.delete);

module.exports = router;
