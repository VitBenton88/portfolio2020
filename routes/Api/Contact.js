module.exports = (app, db) => {

    // CALL FOR RETURNING BOOLEAN IF RECAPTCHA IS CONFIGURED
    // =============================================================
    app.get("/api/contact/recaptcha", async (req, res) => {
        try {
            // query recaptcha config
            const recaptchaConfig = await db.Recaptcha.findOne().lean()
            // check if recaptcha is configured
            let recaptcha = !recaptchaConfig.site_key || !recaptchaConfig.secret_key ? false : true
            // respond to client
            res.status(200).json(recaptcha)
            
        } catch (error) {
            console.error(error)
            res.status(500).json({
                "response": error,
                "message": "Error occurred while fetching recaptcha check."
            })
        }
    })

    // SINGLE FORM REQUEST
    // =============================================================
    app.get("/api/contact/forms/:id?", async (req, res) => {
        try {
            // capture id from params
            const _ids = req.params.id
            // convert id to array incase there are several
            const _ids_Arr = _ids ? _ids.split(',') : undefined

            // query db for forms (when an id(s) is provided, only query for that id)
            const form = _ids ? await db.Forms.find({_id: {$in: _ids_Arr}}).lean() : await db.Forms.find().lean()
        
            // respond to client
            res.status(200).json(form)
            
        } catch (error) {
            console.error(error)
            res.status(500).json({
                "response": error,
                "message": "Error occurred while fetching forms."
            })
        }
    })

    // SMTP CONFIG REQUEST
    // =============================================================
    app.get("/api/contact/smtp", async (req, res) => {
        try {
            // query db for smtp data
            const smtp = await db.Smtp.findOne().lean()

            // check if smtp is configured
            let smtp_setup = false
            const {host, password, port, user} = smtp
            
            if (host && password && port && user) {
                smtp_setup = true
            }

            // respond to client
            res.status(200).json(smtp_setup)
            
        } catch (error) {
            console.error(error)
            res.status(500).json({
                "response": error,
                "message": "Error occurred while fetching smtp configuration."
            })
        }
    })
}