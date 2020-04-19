module.exports = (app, db) => {

	// ADMIN - GET
	// =============================================================
	app.get("/admin", (req, res) => {
		res.redirect('/admin/dashboard')
	})

	// ADMIN DASHBOARD - GET
	// =============================================================
	app.get("/admin/dashboard", async (req, res) => {
		const { site_data, user } = req
		const { _id, username } = user
		const sessionUser = { username, _id }

		try {
			// query data for quick view
			const pages = await db.Pages.find().lean()
			const posts = await db.Posts.find().lean()
			const unreadEntries = await db.Entries.find({read: false}).lean()
			const users = await db.Users.find().lean()
			
			// render
			res.render("admin/dashboard", {
				pages,
				posts,
				site_data,
				sessionUser,
				unreadEntries,
				users,
				layout: "admin"
			})

		} catch (error) {
			console.error(error)
			const errorMessage = error.errmsg || error.toString()
			req.flash('admin_error', errorMessage)
			res.redirect('/')
		}
	})

}