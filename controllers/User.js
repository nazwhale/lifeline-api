const User = require("../models/User");
const { promisify } = require("util");

// https://laravel.com/docs/7.x/controllers#resource-controllers
// Actions Handled By Resource Controller

class UserController {
  static async login(req, res, next) {
    const { email } = req.body.profile;
    const { login_type, external_login_id } = req.body.login_info;

    const findByEmail = promisify(User.findByEmail);
    const save = promisify(User.save);

    try {
      const user = await findByEmail(req.db, email);

      // create new user
      if (user == null) {
        const model = new User({
          email,
          login_type,
          external_login_id
        });
        model.save = promisify(model.save);

        try {
          await model.save(req.db);
          return res.json(model.toJSON());
        } catch (err) {
          next(err);
        }
      }

      return res.json(user.toJSON());
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
