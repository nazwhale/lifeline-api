const Session = require("../models/Session");
const { promisify } = require("util");

// https://laravel.com/docs/7.x/controllers#resource-controllers
// Actions Handled By Resource Controller

class SessionController {
  static async show(req, res, next) {
    const { id } = req.params;
    const findById = promisify(Session.findById);

    try {
      const session = await findById(req.db, id);

      if (session == null) {
        return res.status(404).json({ message: `Session not found: ${id}` });
      }

      return res.json(session.toJSON());
    } catch (err) {
      next(err);
    }
  }

  static async listByUserId(req, res, next) {
    const { id } = req.params;
    const findByUserId = promisify(Session.findByUserId);

    try {
      const sessions = await findByUserId(req.db, id);
      return res.json({ sessions });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    const { access_token, refresh_token, expires_in } = req.auth_details;

    // Convert expires_in to TIMESTAMP
    let expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + expires_in);

    const model = new Session({
      user_id: req.user_id,
      access_token,
      refresh_token,
      expiry: expires_at
    });
    model.save = promisify(model.save);

    try {
      await model.save(req.db);
      req.session = model.toJSON();
      next();
    } catch (err) {
      next(err);
    }
  }

  /* PUT */
  static update(req, res) {}

  /* DELETE */
  static destroy(req, res) {}
}

module.exports = SessionController;
