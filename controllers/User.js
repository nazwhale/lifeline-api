const User = require("../models/User");
const { promisify } = require("util");

const {
  getAuthDetailsFromCode,
  getGoogleUserInfo
} = require("../auth/googleUtil");

// https://laravel.com/docs/7.x/controllers#resource-controllers
// Actions Handled By Resource Controller

class UserController {
  static async login(req, res, next) {
    try {
      const { code } = req.body;

      // Take code from Google Callback
      // Use it to grab user details to read from db
      const details = await getAuthDetailsFromCode(code);
      const userInfo = await getGoogleUserInfo(details.access_token);
      req.auth_details = details;
      req.user_info = userInfo;

      await UserController.createIfNoneExists(req, res, next);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async createIfNoneExists(req, res, next) {
    const { email, id, picture } = req.user_info;
    const { login_type } = req.body;

    const findByEmail = promisify(User.findByEmail);

    try {
      const user = await findByEmail(req.db, email);

      const model = new User({
        email,
        login_type,
        external_login_id: id
      });

      if (user == null) {
        model.save = promisify(model.save);
        try {
          const data = await model.save(req.db);
          model.id = data[0].id;
          return res.json(model.toJSON(picture));
        } catch (err) {
          next(err);
        }
      } else {
        model.updateLoginDetails = promisify(model.updateLoginDetails);
        try {
          const data = await model.updateLoginDetails(req.db);
          model.id = data[0].id;
          return res.json(model.toJSON(picture));
        } catch (err) {
          next(err);
        }
      }

      return res.json(user.toJSON(picture));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
