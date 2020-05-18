var express = require("express");
var router = express.Router();
var verify = require("../auth");

var dao = require("../dao/experiences");

router.post(
  "/",
  verify,
  dao.checkExperienceDateClash,
  dao.createExperience,
  (req, res, next) => {
    const { experiences, error } = req.db_data;

    if (error != null) {
      res.json(error);
    } else {
      const newExperience = experiences[0];
      res.json({
        code: "create_experience",
        experience: newExperience
      });
    }
  }
);

router.get("/", verify, dao.readExperienceById, (req, res, next) => {
  const { experiences } = req.db_data;

  if (experiences.length === 0) {
    console.log("about to 404...");
    res.status(404).json({
      code: "not_found_experience",
      name: `Experience not found. ID: ${req.query.id}`
    });
  } else {
    res.json({
      code: "read_experience",
      data: experiences
    });
  }
});

router.get("/user", verify, dao.readExperienceByUserId, (req, res, next) => {
  const { experiences } = req.db_data;

  if (experiences.length === 0) {
    console.log("about to 404...");
    res.status(404).json({
      code: "not_found_experiences_for_user",
      name: `No experiences for user ID: ${req.query.user_id}`
    });
  } else {
    res.json({
      code: "read_experience",
      data: experiences
    });
  }
});

module.exports = router;
