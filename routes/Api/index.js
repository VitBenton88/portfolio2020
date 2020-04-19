module.exports = (app, db, Utils) => {
	require("./Analog.js")(app)
	require("./Blocks.js")(app, db)
	require("./Contact.js")(app, db)
	require("./Media.js")(app, db)
	require("./Pages.js")(app, db)
	require("./Password.js")(app, Utils)
	require("./Posts.js")(app, db)
}