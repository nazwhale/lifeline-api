const User = require("../models/User");
const { promisify } = require("util");
const SessionController = require("../controllers/Session");

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

      // TODO: find a better place for this
      // return next() in all of these and pop it on the router?
      res.cookie("loggedIn", req.auth_details, {
        maxAge: 900000,
        httpOnly: true
      });

      let userId;
      if (user == null) {
        model.save = promisify(model.save);
        try {
          const data = await model.save(req.db);
          model.id = data[0].id;
          userId = model.id;
        } catch (err) {
          next(err);
        }
      } else {
        model.updateLoginDetails = promisify(model.updateLoginDetails);
        try {
          const data = await model.updateLoginDetails(req.db);
          model.id = data[0].id;
          userId = model.id;
        } catch (err) {
          next(err);
        }
      }

      req.user_id = userId;
      await SessionController.store(req, res, next);

      return res.json(user.toJSON(picture));
    } catch (err) {
      console.log("👋 err in user controller");
      next(err);
    }
  }
}

module.exports = UserController;
