module.exports = (app, db) => {

	// SINGLE MEDIA REQUEST
	// =============================================================
	app.get("/api/blocks/", async (req, res) => {
		try {
			// properties to check
			const props = ['name', 'slug', 'global']
			// default db params
			const params = { active: true }

			for (let i = 0; i < props.length; i++) {
				const prop = props[i];
				const value = req.body[prop];

				if ( value ) {
					params[prop] = value
				}
			}

			// query db for media (when an id(s) is provided, only query for that id)
			const blocks = await db.Blocks.find( params ).lean()
			// respond to client
			res.status(200).json(blocks)

		} catch (error) {
			console.error(error)
			res.status(500).json({
				"response": error,
				"message": "Error occurred while fetching blocks."
			})
		}
	})

}