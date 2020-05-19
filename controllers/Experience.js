const { Experience } = require("../models/Experience");

// https://laravel.com/docs/7.x/controllers#resource-controllers
// Actions Handled By Resource Controller

class ExperienceController {
  static show(req, res, next) {
    const id = req.params.id;
    try {
      const instance = Experience.findById(id);
      return instance.toJSON();
    } catch (e) {
      return next(e);
    }
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
