module.exports = (app, bcrypt, db, slugify, Utils, validator) => {

  require("./404s.js")(app, db, Utils)
  require("./Contact.js")(app, db, Utils)
  require("./CustomFields.js")(app, db, slugify)
  require("./Dashboard.js")(app, db)
  require("./Entries.js")(app, db, Utils)
  require("./Initialize.js")(app, bcrypt, db)
  require("./Forms.js")(app, db, slugify, Utils)
  require("./Media.js")(app, db, Utils)
  require("./Menus.js")(app, db, slugify, Utils)
  require("./Pages.js")(app, db, slugify, Utils)
  require("./Posts.js")(app, db, slugify, Utils)
  require("./Redirects.js")(app, db, Utils)
  require("./Summernote.js")(app, Utils)
  require("./Taxonomies.js")(app, db, Utils)
  require("./Terms.js")(app, db)
  require("./Users.js")(app, bcrypt, db, Utils, validator)
  require("./Settings.js")(app, db, Utils)

}