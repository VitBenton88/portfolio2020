module.exports = (app, db, slugify, Utils) => {

    // FORMS PAGE GET
    // =============================================================
    app.get("/admin/contact/forms", async (req, res) => {
        try {
            const {
                body,
                query,
                site_data,
                user
            } = req

            let {
                limit,
                orderBy,
                paged,
                search,
                sort
            } = query

            const sessionUser = {
                role: user.role,
                username: user.username,
                _id: user._id
            }

            // if the orderBy queries don't exist in the url params, this is to ensure orderBy works with a search form
            orderBy = orderBy || body.orderBy
            sort = sort || body.sort

            // set query limit to 10 as default, or use defined limit (converted to int)
            limit = limit ? parseInt(limit) : 10

            // set paged to 1 as default, or use defined query (converted to int)
            paged = paged ? parseInt(paged) : 1

            // determine offset in query by current page in pagination
            const skip = paged > 0 ? ((paged - 1) * limit) : 0

            // get query count for pagination
            const count = await db.Forms.find().count()
            const pageCount = Math.ceil(count / limit)
            // setup query params
            const sortConfig = orderBy ? Utils.Sort.getConfig(orderBy, sort) : {
                'created': 1
            }
            const searchParams = search ? {
                $text: {
                    $search: search
                }
            } : {}

            // query db
            const forms = await db.Forms.find(searchParams).sort(sortConfig).skip(skip).limit(limit)
            // swap sort after the query if there is an order requested, e.g. desc to asc
            sort = orderBy ? Utils.Sort.swapOrder(sort) : null

            res.render("admin/forms", {
                forms,
                limit,
                orderBy,
                pageCount,
                paged,
                search,
                sessionUser,
                site_data,
                sort,
                layout: "admin"
            })

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect('/admin')
        }
    })

    // EDIT FORM PAGE - GET
    // =============================================================
    app.get("/admin/contact/forms/edit/:id", async (req, res) => {
        try {
            const {
                originalUrl,
                site_data,
                user
            } = req

            const sessionUser = {
                username: user.username,
                _id: user._id
            }
            
            res.render("admin/edit/form", {
                originalUrl,
                sessionUser,
                site_data,
                layout: "admin"
            })

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect('/admin/contact/forms')
        }
    })

    // ADD FORM PAGE - GET
    // =============================================================
    app.get("/admin/contact/forms/add", (req, res) => {

        const {
            originalUrl,
            site_data,
            user
        } = req

        const sessionUser = {
            username: user.username,
            _id: user._id
        }

        res.render("admin/add/form", {
            originalUrl,
            sessionUser,
            site_data,
            layout: "admin"
        })
    })

    // ADD FORM - POST
    // =============================================================
    app.post("/addform", async (req, res) => {
        try {
            const {
                name,
                fields,
                mail,
                settings
            } = req.body

            const slug = slugify(name)

            // some basic validation
            if (!name || !slug || !fields.length) {
                throw new Error('Form creation attempt failed due to missing required fields.')
            }

            // create form in db
            const newFrom = await db.Forms.create({ name, slug, fields, mail, settings })

            req.flash(
                'success',
                'Form successfully added.'
            )
            res.status(200).json(newFrom)

        } catch (error) {
            console.error(error)
            req.flash('error', error)
            res.status(500).json(error)
        }
    })

    // UPDATE FORM - POST
    // =============================================================
    app.post("/updateform", async (req, res) => {
        const {
            _id,
            name,
            fields,
            mail,
            settings
        } = req.body

        try {
            const slug = slugify(name)

            // some basic validation
            if (!name || !slug) {
                throw new Error('Form creation attempt failed due to missing required fields.')
            }

            // update query to db
            const updatedForm = await db.Forms.findOneAndUpdate({_id }, { name, fields, mail, settings })

            // respond
            res.status(200).json(updatedForm)

        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('error', errorMessage)
            res.redirect(`/admin/contact/forms/edit/${_id}`)
        }
    })

    // UPDATE SEVERAL FORMS - POST
    // =============================================================
    app.post("/updateformmulti", async (req, res) => {
        try {
            const {
                list_id_arr,
                update_criteria,
                update_value
            } = req.body

            // check if this is a delete query
            const deleteQuery = update_criteria === 'delete';

            //define db query based on update criteria
            const Query = deleteQuery ? db.Forms.deleteMany({
                _id: {
                    $in: list_id_arr
                }
            }) : db.Forms.updateMany({
                _id: {
                    $in: list_id_arr
                }
            }, {
                $set
            });

            // update pages in db ...
            await Query

            const flashMsg = deleteQuery ? 'Forms successfully deleted.' : 'Bulk edit successful.'

            req.flash('success', flashMsg)
            res.send(true);

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect(`/admin/contact/forms`)
        }
    })

    // DELETE FORM - POST
    // =============================================================
    app.post("/deleteform", async (req, res) => {
        const { _id } = req.body
        try {
            // delete query to db
            await db.Forms.deleteOne({
                _id
            })
            // pull form from any pages and posts that use it
            await db.Pages.updateMany({
                forms: {
                    $in: _id
                }
            }, {
                $pull: {
                    forms: {
                        $in: _id
                    }
                }
            })
            await db.Posts.updateMany({
                forms: {
                    $in: _id
                }
            }, {
                $pull: {
                    forms: {
                        $in: _id
                    }
                }
            })

            req.flash(
                'success',
                'Form successfully deleted.'
            )
            res.status(200).end()

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect(`/admin/contact/forms/edit/${_id}`)
        }
    })

    // HANDLE FORM SUBMISSIONS - POST
    // =============================================================
    app.post("/analog/form/:_id", async (req, res) => {
        const { body, files, ip, params, recaptchaScore, site_data } = req

        // capture form id
        const { _id } = params
        const { formLocation } = body

        try {
            // query form
            const form = await db.Forms.findById({ _id })
            const { name, fields, mail } = form
            let { recipients, replyTo, subject, success, redirect } = mail
            const destination = redirect ? redirect : formLocation
            const mediaNames = []
            const submittedFields = []
            const successContainsVars = success.includes('{{') && success.includes('}}')
            const subjectContainsVars = subject.includes('{{') && subject.includes('}}')
            const replyToContainsVars = replyTo.includes('{{') && replyTo.includes('}}')

            // loop through fields to do some stuff
            fields.forEach((field, i) => {
                const { name, label, required, type } = field
                let value = body[name]
                // push all file inputs to array for uploading and reformat value
                if (type === 'file' && files) {
                    const file = files[name]
                    const multipleFiles = Array.isArray(file)
                    const routes = Utils.Storage.getRoute(file, multipleFiles, false)
                    value = multipleFiles ? routes.map((route) => route.absolutePath) : routes.absolutePath
                    mediaNames.push(name)
                }
                // skip submit buttons, copy, and empty values
                if (type === 'submit' || type === 'copy' || !value) {
                    return
                }
                // make sure all required fields are satisfied
                if (required && !value) {
                    throw new Error(`Missing value for the required "${label || name}" field.`)
                }
                // collect all field data for entry recording
                const fieldEntry = {name, value, label}
                submittedFields.push(fieldEntry)
              })

            // query SMTP config
            const smtp = await db.Smtp.findOne()
            // capture SMTP values
            const { host, password, port, user } = smtp

            // upload media
            if (files && mediaNames.length) {
                mediaNames.forEach(async (name, i) => {
                    const uploadedMedia = await Utils.Storage.write(files[name], site_data.settings.storage)
                    const {renames} = uploadedMedia
                    // if there were renames, the file names have to updated for the entry and email
                    if (renames.length) {
                        submittedFields.forEach(submittedField => {
                            const {value} = submittedField
                            renames.forEach(rename => {
                                const {newName, originalName} = rename
                                // handle instances when multiple files were uploaded for one field
                                if (Array.isArray(value)) {
                                    value.forEach((path, pathIndex) => {
                                        if (path.includes(originalName)) {
                                            submittedField.value[pathIndex] = submittedField.value[pathIndex].replace(originalName, newName)
                                        } 
                                    })
                                } else {
                                    if (value.includes(originalName)) {
                                        submittedField.value = value.replace(originalName, newName)
                                    }
                                }
                            })
                        })
                    }
                })
            }

            // setup meta object for entry
            const meta = {}
            if (ip) {
                meta.ip = ip
            }
            if (recaptchaScore) {
                meta.recaptchaScore = recaptchaScore
            }

            // record entry
            const entry = await db.Entries.create({form: _id, fields: submittedFields, meta})
            // record entry to the form
            await db.Forms.updateOne({_id}, { $push: {entries: entry._id} })

            // if smtp settings, fire smtp, otherwise end with response
            if (host && password && port && user) {
                const text = `Form submission from form '${name}.'`
                const html = `<p>${text}</p><table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>${submittedFields.map((field) => `<tr><td>${field.label || field.name}</td><td>${field.value}</td></tr>`).join('')}</tbody></table>`
                // replace any embedded vars in subject, success, and replyl-to message config strings with actual values
                if (successContainsVars || subjectContainsVars || replyToContainsVars) {
                    submittedFields.forEach(submittedField => {
                        let {name, value} = submittedField
                        if (successContainsVars) {
                            success = success.replace(new RegExp(`\{\{(?:\\s+)?(${name})(?:\\s+)?\}\}`), value)
                        }
                        if (subjectContainsVars) {
                            subject = subject.replace(new RegExp(`\{\{(?:\\s+)?(${name})(?:\\s+)?\}\}`), value)
                        }
                        if (replyToContainsVars) {
                            replyTo = replyTo.replace(new RegExp(`\{\{(?:\\s+)?(${name})(?:\\s+)?\}\}`), value)
                        }
                    })
                }

                // setup mail options
                let mailData = {
                    to: recipients,
                    subject,
                    text,
                    html
                }

                // add replyTo mail header if one is provided
                if (replyTo) {
                    mailData.replyTo = replyTo
                }
                // add attatchements
                if (mediaNames.length) {
                    const attachments = []
                    submittedFields.forEach(field => {
                        const { name, value } = field
                        if (name.includes('file')) {
                            if (Array.isArray(value)) {
                                value.forEach(path => {
                                    attachments.push({path})
                                })
                            } else {
                                attachments.push({path: value})
                            }
                        }
                    })
                    // add attachments to mailData object
                    mailData.attachments = attachments
                }
    
                // send mail
                await Utils.Smtp.send(mailData)
            }

            req.flash('success', success)
            res.status(200).redirect(destination)

        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString() || error
            req.flash('error', errorMessage)
            res.status(400).redirect(formLocation)
        }
    })

}
