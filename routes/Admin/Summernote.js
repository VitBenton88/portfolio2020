module.exports = (app, Utils) => {

	// HANDLE IMAGES UPLOADED VIA WYSIWYG EDITOR - POST
	// =============================================================

	app.post('/editorimageuploads', async (req, res) => {
		if (req.files === null) {
			return res.status(406).json({ msg: 'No file uploaded' })
		}

		try {
			const file = req.files.file
			const uploadFile = await Utils.Storage.write(file, req.site_data.settings.storage)
			// respond
			res.json({ fileName: file.name, filePath: uploadFile.media.path })

		} catch (error) {
			console.error(error)
			res.status(500).json({ msg: error })
		}
	})

}