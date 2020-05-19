const ExperienceController = require("../controllers/Experience");
var express = require("express");
var router = express.Router();

router.get("/", ExperienceController.index);
router.delete("/:id", ExperienceController.delete);
router.get("/:id", ExperienceController.show);

module.exports = router;
