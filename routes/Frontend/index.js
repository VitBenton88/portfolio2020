module.exports = (app, db, passport, Recaptcha, Utils) => {
  require("./All.js")(app, db, Recaptcha)
  require("./Login.js")(app, passport)
  require("./Search.js")(app, db)
  require("./Sitemap.js")(app, Utils)
}