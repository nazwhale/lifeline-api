const Experience = require("../models/Experience");
const { promisify } = require("util");

// https://laravel.com/docs/7.x/controllers#resource-controllers
// Actions Handled By Resource Controller

class ExperienceController {
  static async show(req, res, next) {
    const { id } = req.params;
    const findById = promisify(Experience.findById);

    try {
      const experience = await findById(req.db, id);

      if (experience == null) {
        return res.status(404).json({ message: `Experience not found: ${id}` });
      }

      return res.json(experience.toJSON());
    } catch (err) {
      next(err);
    }
  }

  static async listByUserId(req, res, next) {
    const { id } = req.params;
    const findByUserId = promisify(Experience.findByUserId);

    try {
      const experiences = await findByUserId(req.db, id);
      return res.json({ experiences });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    const { title, start_date, end_date, user_id } = req.body;
    const model = new Experience({ title, start_date, end_date, user_id });
    model.save = promisify(model.save);

    try {
      await model.validate(req.db);
      await model.save(req.db);
      return res.json(model.toJSON());
    } catch (err) {
      next(err);
    }
  }

  /* PUT */
  static update(req, res) {}

  /* DELETE */
  static destroy(req, res) {}
}

module.exports = ExperienceController;
