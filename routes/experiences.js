const express = require("express");
const router = express.Router();
const verify = require("../auth");
const ExperienceController = require("../controllers/Experience");

const dao = require("../models/Experience");

// const { promisify } = require("utils");

// Experience.findById(1); // => new Experience()

router.post("/", ExperienceController.store);

// router.post(
//   "/hi",
//   // dao.checkExperienceDateClash,
//   //  dao.createExperience,
//   (req, res, next) => {
//     console.log("POST /experience");
//     //const { experiences, error } = req.db_data;
//     // if (error != null) {
//     //   res.json(error);
//     // } else {
//     //   const newExperience = experiences[0];
//     //   res.json({
//     //     code: "create_experience",
//     //     experience: newExperience
//     //   });
//     // }
//   }
// );

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
      experiences: experiences
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
      code: "read_experiences_for_user",
      experiences: experiences
    });
  }
});

module.exports = router;

// ===========================================
// handler

// const { json } = require("micro");

// const rsmq = require("../queue/rsmq");

// const { async } = require("./utils");

// module.exports = async (req, res) => {
//   const { key } = req.params;
//   const value = await json(req);

//   // Hack: Extract the redis instance out of the rsmq
//   // instance we've already set up for the worker.
//   const instance = await rsmq.instance();
//   const { redis } = instance.rsmq;

//   const set = async(redis, "set");
//   await set(key, JSON.stringify(value));

//   return { key };
// };

// // ==========
// // utils

// const { promisify } = require("util");

// module.exports.async = (client, method) =>
//   promisify(client[method]).bind(client);

//   // client.set
