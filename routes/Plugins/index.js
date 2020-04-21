module.exports = (app, db, Utils) => {
	require("./Initialize.js")(app, db)
	require("./Projects.js")(app, db)
}