module.exports = (app, db, Utils) => {
	require("./Initialize.js")(app, db)
	require("./Test.js")(app, db)
}