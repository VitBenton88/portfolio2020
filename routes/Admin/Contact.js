module.exports = (app, db, Utils) => {

    // SETTINGS PAGE - GET
    // =============================================================
    app.get("/admin/contact/settings", async (req, res) => {
        const { originalUrl, query, site_data, user } = req
        const { expand } = query
        const sessionUser = { username: user.username, _id: user._id }

        try {
            const recaptcha = await db.Recaptcha.findOne().lean()
            const smtp = await db.Smtp.findOne().lean()

            res.render("admin/contact", {
                expand,
                originalUrl,
                recaptcha,
                site_data,
                sessionUser,
                smtp,
                layout: "admin"
            })

        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('admin_error', errorMessage)
            res.redirect('/admin/contact/settings')
        }
    })

    // UPDATE SMTP - POST
    // =============================================================
    app.post("/updatesmtp", async (req, res) => {
        const redirect_ul = '/admin/contact/settings?expand=smtp'
        let { host, _id, password, port, secure, user } = req.body
        secure = secure == "on" ? true : false

        try {
            // define db query
            const params = {
                host,
                password,
                port,
                secure,
                user
            }

            const Query = _id.length ? db.Smtp.updateOne({ _id }, params) : db.Smtp.create(params)

            // fire query
            await Query

            req.flash(
                'admin_success',
                'SMTP settings successfully updated.'
            )
            res.redirect(redirect_ul)

        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('admin_error', errorMessage)
            res.redirect(redirect_ul)
        }
    })

    // SEND TEST SMTP EMAIL - POST
    // =============================================================
    app.post("/testsmtp", async (req, res) => {
        const redirect_ul = '/admin/contact/settings'
        const emailTo = req.body.emailTo

        try {
            // some basic validation
            if (!emailTo) {
                throw new Error('Recipient email not provided for SMTP test email.')
            }

            const mailData = {
                to: emailTo,
                subject: 'Analog CMS Successful Test Email',
                text: 'This is a successful test email sent from an Analog CMS.',
                html: '<p>This is a successful test email sent from an Analog CMS.</p>'
            }

            // send
            await Utils.Smtp.send(mailData)

            req.flash(
                'admin_success',
                'Test email successfully sent.'
            )
            res.redirect(redirect_ul)

        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('admin_error', errorMessage)
            res.redirect(redirect_ul)
        }
    })

    // VERIFY SMTP CONFIG - POST
    // =============================================================
    app.post("/verifysmtp", async (req, res) => {
        try {
            // verify connection configuration
            await Utils.Smtp.verify()

            res.json({
                "message": "Verification Successful.",
                "response": "SMTP settings successfully verified."
            })
            
        } catch (error) {
            console.error(error)
            if (error.responseCode === 535) {
                return res.status(406).json({
                    "response": error.repsonse,
                    "message": "Authentication unsuccessful"
                })
            }

            res.status(500).json({
                "response": error,
                "message": "An error occured. Host or port may be incorrect."
            })
        }
    })

    // UPDATE RECAPTCHA - POST
    // =============================================================
    app.post("/updaterecaptcha", async (req, res) => {
        const redirect_ul = '/admin/contact/settings?expand=recaptcha'
        let { _id, secret_key, site_key } = req.body

        try {
            // create db query
            const params = {
                secret_key,
                site_key
            }
    
            const Query = _id.length ? db.Recaptcha.updateOne({ _id }, params) : db.Recaptcha.create(params)

            // fire query
            await Query

            req.flash(
                'admin_success',
                'reCAPTCHA settings successfully updated.'
            )
            res.redirect(redirect_ul)

        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('admin_error', errorMessage)
            res.redirect(redirect_ul)
        }
    })

}