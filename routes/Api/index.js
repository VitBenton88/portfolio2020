module.exports = (app, db) => {

 require("./Analog.js")(app, db)
 require("./Contact.js")(app, db)
 require("./Media.js")(app, db)
 require("./Pages.js")(app, db)
 require("./Posts.js")(app, db)

}