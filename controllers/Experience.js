const Experience = require("../models/Experience");

// https://laravel.com/docs/7.x/controllers#resource-controllers
// Actions Handled By Resource Controller

class ExperienceController {
  static async show(req, res, next) {
    const { id } = req.params;
    let experience;

    try {
      experience = await Experience.findById(req.db, id);
    } catch (e) {
      next(e);
    }

    if (experience == null) {
      return res.status(404).json({ message: `Experience not found: ${id}` });
    }

    return res.json(experience.toJSON());
  }

  static async listByUserId(req, res, next) {
    const { id } = req.params;
    let experiences;

    try {
      experiences = await Experience.findByUserId(req.db, id);
    } catch (e) {
      next(e);
    }

    return res.json({ experiences: experiences });
  }

  static async store(req, res, next) {
    const { title, start_date, end_date, user_id } = req.body;
    const model = new Experience({ title, start_date, end_date, user_id });

    try {
      await model.validate(req.db);
      await model.save(req.db);
    } catch (err) {
      next(err);
    }

    return res.json(model.toJSON());
  }

  /* PUT */
  static update(req, res) {}

  /* DELETE */
  static destroy(req, res) {}
}

module.exports = ExperienceController;
