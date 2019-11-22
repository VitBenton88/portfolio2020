module.exports = (app, db, Utils) => {

  // SETTINGS GET
  // =============================================================
  app.get("/admin/settings", (req, res) => {
    const {
      originalUrl,
      site_data,
      user
    } = req
    
    const sessionUser = {
      username: user.username,
      _id: user._id
    }

    res.render("admin/settings", {
      originalUrl,
      site_data,
      sessionUser,
      layout: "admin"
    })
  })

  // UPDATE META HEAD - POST
  // =============================================================
  app.post("/updatemetahead", async (req, res) => {
    try {
      let {
        _id,
        meta_head
      } = req.body

      // db update query
      await db.Analog.updateOne({_id}, {'settings.meta_head': meta_head})

      req.flash(
        'success',
        'Meta head successfully updated.'
      )
      res.redirect('/admin/settings')

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/settings');
    }
  })

  // UPDATE META BODY - POST
  // =============================================================
  app.post("/updatemetabody", async (req, res) => {
    try {
      let {
        _id,
        meta_body
      } = req.body

      // db update query
      await db.Analog.updateOne({_id}, {'settings.meta_body': meta_body})

      req.flash(
        'success',
        'Meta body successfully updated.'
      )
      res.redirect('/admin/settings')

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/settings')
    }
  })

  // UPDATE SITE INFO - POST
  // =============================================================
  app.post("/updatesiteinformation", async (req, res) => {
    try {
      let {
        _id,
        address,
        description,
        name
      } = req.body

      const params = {'settings.address': address, 'settings.description': description, 'settings.name': name}

      // db update query
      await db.Analog.updateOne({_id}, params)

      req.flash(
        'success',
        'Site information successfully updated.'
      )
      res.redirect('/admin/settings')

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/settings')
    }
  })

    // UPDATE LOCAL STORAGE CONFIG - POST
  // =============================================================
  app.post("/updatelocalstorage", async (req, res) => {
    try {
      // db update query
      await db.Analog.updateOne({_id: req.body._id}, {'settings.storage.type': 'local'})

      req.flash(
        'success',
        'Site storage configuration successfully updated to local storage.'
      )
      res.redirect('/admin/settings')
      
    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/settings')
    }
  })

    // UPDATE GOOGLE CLOUD STORAGE CONFIG - POST
  // =============================================================
  app.post("/updategooglecloudstorage", async (req, res) => {
    try {
      let {
        _id,
        bucketName,
        projectId
      } = req.body
      
      // basic validation
      if (!bucketName || !projectId) {
        throw new Error('Google Cloud storage credentials missing. Please fill out all fields.')
      }

      const params = {
        'settings.storage.configurations.googleCloud.bucketName': bucketName,
        'settings.storage.configurations.googleCloud.projectId': projectId,
        'settings.storage.type': 'googleCloud'
      }

      // db update query
      await db.Analog.updateOne({_id}, params)

      req.flash(
        'success',
        'Site storage configuration successfully updated to Google Cloud Storage.'
      )
      res.redirect('/admin/settings')

    } catch (error) {
      console.error(error)
      const errorMessage = error.errmsg || error.toString()
      req.flash('error', errorMessage)
      res.redirect(`/admin/settings`)
    }
  })

    // UPDATE AWS S3 CONFIG - POST
  // =============================================================
  app.post("/updateawsstorage", async (req, res) => {
    try {
      let {
        _id,
        accessKeyId,
        bucketName,
        secretAccessKey
      } = req.body
      
      // basic validation
      if (!bucketName || !accessKeyId || !secretAccessKey) {
        throw new Error('AWS S3 storage credentials missing. Please fill out all fields.')
      }

      const params = {
        'settings.storage.configurations.aws.accessKeyId': accessKeyId,
        'settings.storage.configurations.aws.bucketName': bucketName,
        'settings.storage.configurations.aws.secretAccessKey': secretAccessKey,
        'settings.storage.type': 'aws'
      }

      // db update query
      await db.Analog.updateOne({_id}, params)

      req.flash(
        'success',
        'Site storage configuration successfully updated to AWS S3.'
      )
      res.redirect('/admin/settings')

    } catch (error) {
      console.error(error)
      const errorMessage = error.errmsg || error.toString()
      req.flash('error', errorMessage)
      res.redirect(`/admin/settings`)
    }
  })

}