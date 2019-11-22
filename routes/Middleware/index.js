module.exports = (app, db, ensureAuthenticated, Recaptcha) => {

  require("./Authenticate.js")(app, ensureAuthenticated)
  require("./Permissions.js")(app)
  require("./Redirects.js")(app, db)
  require("./Recaptcha.js")(app, db, Recaptcha)
  require("./Settings.js")(app, db)
  require("./Menus.js")(app, db)

}