const { Experience } = require("../models/Experience");

// https://laravel.com/docs/7.x/controllers#resource-controllers
// Actions Handled By Resource Controller

class ExperienceController {
  static async show(req, res, next) {
    const id = req.query.id;
    let instance;
    try {
      instance = await Experience.findById(req.db, id);
    } catch (e) {
      next(e);
    }

    if (instance == null) {
      return res.status(404).json({ message: `Experience not found: ${id}` });
    }

    return res.json(instance.toJSON());
  }

  static async store(req, res, next) {
    const { title, start_date, end_date, user_id } = req.body;
    const model = new Experience({ title, start_date, end_date, user_id });

    try {
      await model.save(req.db);
    } catch (e) {
      next(e);
    }

    return res.json(model.toJSON());
  }

  static update(req, res) {
    // const { title, start_date, end_date, user_id } = req.body;
    // const model = new Experience({ title, start_date, end_date, user_id })
    //
    // try {
    //     await model.validate()
    //     await model.save()
    // }
    // catch (e) {
    //  next(e)
    // }
    //
    // return res.json(model.toJSON())
  }

  static index(req, res) {}

  static destroy(req, res) {}
}

module.exports = ExperienceController;
