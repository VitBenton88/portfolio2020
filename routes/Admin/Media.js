module.exports = (app, db, Utils) => {

    // MEDIA PAGE - GET
    // =============================================================
    app.get("/admin/media", async (req, res) => {
        try {
            const {
                originalUrl,
                query,
                site_data,
                user
            } = req
            const sessionUser = {
                username: user.username,
                _id: user._id
            }
            let {
                orderBy,
                search
            } = query
            const params = {}

            if (orderBy) {
                params['storage'] = orderBy
            }

            if (search) {
                params['$text'] = {
                    $search: search
                }
            }

            const media = await db.Media.find(params)

            res.render("admin/media", {
                media,
                orderBy,
                originalUrl,
                search,
                sessionUser,
                site_data,
                layout: "admin"
            })

        } catch (error) {
            // if an error occurred, send it to the client
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect('/admin')
        }

    })

    // ADD MEDIA - POST
    // =============================================================
    app.post("/uploadmedia", async (req, res) => {
        try {
            const {
                files,
                site_data
            } = req

            const {type} = site_data.settings.storage

            // basic validation
            if (!files.media) {
                throw new Error('No file submitted. Please try again.')
            }

            // prevent bulk uploads on cloud storage
            if (Array.isArray(files.media) && type !== 'local') {
                throw new Error('Cannot process bulk uploads for cloud storage. Please upload files one at a time or change storage configuration to local.')
            }

            // upload media
            await Utils.Storage.write(files.media, site_data.settings.storage)

            req.flash(
                'success',
                'Media successfully added.'
            )
            res.redirect('/admin/media')

        } catch (error) {
            // if an error occurred, send it to the client
            const errorMessage = error.errmsg || error.toString()
            req.flash('error', errorMessage)
            res.redirect('/admin/media')
        }

    })

    // UPDATE MEDIA - POST
    // =============================================================
    app.post("/updatemedia", async (req, res) => {
        try {
            const {
                alt,
                caption,
                description,
                _id
            } = req.body

            // prepare meta object for db 
            const meta = {alt, caption, description}
            // update media in db
            await db.Media.updateOne({_id}, {meta})

            req.flash(
                'success',
                'Media successfully updated.'
            )
            res.redirect('/admin/media')

        } catch (error) {
            // if an error occurred, send it to the client
            const errorMessage = error.errmsg || error.toString()
            req.flash('error', errorMessage)
            res.redirect('/admin/media')
        }

    })

    // DELETE MEDIA (SINGLE) - POST
    // =============================================================
    app.post("/deletemedia", async (req, res) => {
        try {
            const {
                body,
                site_data
            } = req

            const {
                _id,
            } = body

            // query db for all of the file's info
            const media = await db.Media.findById(_id)

            // delete file from storage, also deletes media record and removes it from associations
            await Utils.Storage.delete(media, site_data.settings.storage)

            res.json({
                "response": 'Success.',
                "message": 'Media successfully deleted.'
            })

        } catch (error) {
            // if an error occurred, send it to the client
            console.error(error)
            res.status(500).json({
                "response": error,
                "message": "Media not deleted. Error occurred."
            })
        }

    })

    // DELETE MEDIA (MULTIPLE) - POST
    // =============================================================
    app.post("/deletemediamulti", async (req, res) => {
        try {
            const {
                body,
                site_data
            } = req

            const {
                _id_arr,
            } = body
            
            // query db for all of the file's info
            const media = await db.Media.find({_id: {$in: _id_arr}})

            // delete file from storage, also deletes media record and removes it from associations
            await Utils.Storage.delete(media, site_data.settings.storage)

            res.json({
                "response": 'Success.',
                "message": 'Multiple media items successfully deleted.'
            })

        } catch (error) {
            // if an error occurred, send it to the client
            console.error(error)
            res.status(500).json({
                "response": error,
                "message": "Media not deleted. Error occurred."
            })
        }

    })

}
