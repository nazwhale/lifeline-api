const express = require("express");
const router = express.Router();
const verify = require("../auth");
const ExperienceController = require("../controllers/Experience");

const dao = require("../models/Experience");

router.post("/", ExperienceController.store);
router.get("/:id", ExperienceController.show);
router.get("/user/:id", ExperienceController.listByUserId);
// router.delete("/:id", ExperienceController.delete);

module.exports = router;

// =====================Dan's example======================
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
