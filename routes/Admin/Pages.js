module.exports = (app, db, slugify, Utils) => {

  // PAGES - GET
  // =============================================================
  app.get("/admin/pages", async (req, res) => {
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

      // get templated for user to select
      const templates = await Utils.Templates.getAll()

      // get query count for pagination
      const count = await db.Pages.find().count()
      const pageCount = Math.ceil(count / limit)
      // setup query params
      const sortConfig = orderBy ? Utils.Sort.getConfig(orderBy, sort) : {'created': 1}
      const searchParams = search ? {$text: {$search: search} } : {}

      // query db
      const pages = await db.Pages.find(searchParams).sort(sortConfig).skip(skip).limit(limit).populate('permalink')
      // swap sort after the query if there is an order requested, e.g. desc to asc
      sort = orderBy ? Utils.Sort.swapOrder(sort) : null

      res.render("admin/pages", {
        limit,
        orderBy,
        pageCount,
        paged,
        pages,
        search,
        sessionUser,
        site_data,
        sort,
        templates,
        layout: "admin"
      })

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin')
    }
  })

  // ADD PAGE ... PAGE - GET
  // =============================================================
  app.get("/admin/pages/add", async (req, res) => {
    try {
      const {
        site_data,
        user
      } = req
  
      const sessionUser = {
        username: user.username,
        _id: user._id
      }

      // get templated for user to select
      const templates = await Utils.Templates.getAll()
      // query all but this page for choosing parent
      const pages = await db.Pages.find({active: true}).populate('permalink')
      // get forms
      const forms = await db.Forms.find()

      res.render("admin/add/page", {
        forms,
        pages,
        templates,
        sessionUser,
        site_data,
        layout: "admin"
      })

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/pages')
    }
  })

  // ADD PAGE - POST
  // =============================================================
  app.post("/addpage", async (req, res) => {
    const {
      body,
      user
    } = req

    let {
      active,
      content,
      forms,
      homepage,
      image,
      metaTitle,
      metaDescription,
      parent,
      private,
      sitemap,
      template,
      title
    } = body

    try {
      // basic validation
      if (!template || !title) {
        throw new Error('Please fill out all fields when adding a page.')
      }
  
      active = active == "on" ? true : false
      private = private == "on" ? true : false
      homepage = homepage == "on" ? true : false
      parent = parent === 'none' ? null : parent
      sitemap = sitemap == "on" ? true : false
      image = image === '' ? null : image
      const author = user._id
      let route = slugify(title)
      
      console.log(private);

      // check if provided permalink already exists before page is created
      const permalinkExists = await Utils.Permalinks.permalinkExists(route)

      if (permalinkExists) {
        route = `${route}2`
      }

      // create page in db ...
      const createdPage = await db.Pages.create({active, author, content, forms, homepage, image, private, template, title})
      const ownerModel = 'Pages'
      const owner = createdPage.id

      // then create its permalink in the Permalinks document ...
      const createdPermalink = await db.Permalinks.create({route, owner, ownerModel, parent, sitemap})
      const permalink = createdPermalink.id

      // then create its meta in the meta document ...
      const createdMeta = await db.Meta.create({title: metaTitle, description: metaDescription, owner, ownerModel})
      const meta = createdMeta.id

      // finally go back and assign that permalink and meta to the newly created page
      await db.Pages.updateOne({_id: owner}, {permalink, meta})

      req.flash(
        'success',
        'Page successfully added.'
      )
      res.redirect(`/admin/pages/edit/${owner}`)

    } catch (error) {
      console.error(error)
      let errorMessage = error.errmsg || error.toString()
      req.flash('error', errorMessage)
      res.redirect(`/admin/pages`)
    }
  })

  // EDIT PAGE ... PAGE - GET
  // =============================================================
  app.get("/admin/pages/edit/:id", async (req, res) => {
    try {
      const {
        params,
        site_data,
        user
      } = req

      const sessionUser = {
        username: user.username,
        _id: user._id
      }

      const _id = params.id

      // collect data for render method
      const page = await db.Pages.findById({_id}).populate('permalink')
      // query all but this page for choosing parent
      const pages = await db.Pages.find({active: true, _id: { $nin: _id } }).populate('permalink')
      const templates = await Utils.Templates.getAll()
      const forms = await db.Forms.find()

      res.render("admin/edit/page", {
        forms,
        page,
        pages,
        sessionUser,
        site_data,
        templates,
        layout: "admin"
      })

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/pages')
    }
  })

  // UPDATE PAGE - POST
  // =============================================================
  app.post("/updatepage", async (req, res) => {
    let {
      _id,
      active,
      content,
      forms,
      homepage,
      image,
      metaTitle,
      metaDescription,
      originalRoute,
      parent,
      private,
      route,
      sitemap,
      template,
      title
    } = req.body

    try {
      // basic validation
      if (!template || !title || !route) {
        throw new Error('Please fill out all required fields when editing a page.')
      }
      
      active = active == "on" ? true : false
      private = private == "on" ? true : false
      homepage = homepage == "on" ? true : false
      sitemap = sitemap == "on" ? true : false
      image = image === '' ? null : image
      parent = parent === 'none' ? null : parent
  
      // set updated time for now
      const updated = Date.now()


      // make sure route is in slug format
      route = slugify(route)
      // update post's fields in db ...
      const updatedPage = await db.Pages.findOneAndUpdate({_id}, {active, content, forms, homepage, image, private, template, title, updated})
      // capture the id of updated page
      const owner = updatedPage.id
      // then update the permalink in the Permalinks document ...
      const updatedPermalink = await db.Permalinks.findOneAndUpdate({owner}, {route, parent, sitemap}, {new: true})
      // then update the meta in the meta document ...
      await db.Meta.updateOne({owner}, {description: metaDescription, title: metaTitle})
      // finally update any links that use this page's route (that were created as a reference to an existing page)
      await db.Links.updateMany({route: `/${originalRoute}`, is_ref: true}, {route: `/${updatedPermalink.full}`})

      req.flash(
        'success',
        'Page successfully updated.'
      )
      res.redirect(`/admin/pages/edit/${_id}`)
      
    } catch (error) {
      console.error(error)

      let errorMessage = error.errmsg || error.toString()
      // if this is a dup error, notify the user about it
      if (error.code == 11000) {
        if (errorMessage.includes('route')) {
          errorMessage = `The permalink "${route}" is already taken.`
        }
        if (errorMessage.includes('homepage')) {
          errorMessage = `There is already a homepage set.`
        }
      }

      req.flash('error', errorMessage)
      res.redirect(`/admin/pages/edit/${_id}`)
    }
  })

  // UPDATE SEVERAL PAGES - POST
  // =============================================================
  app.post("/updatepagemulti", async (req, res) => {
    try {
      const {
        list_id_arr,
        update_criteria,
        update_value
      } = req.body

      const active = (update_value === 'active')
  
      // set updated time for now
      const updated = Date.now()
  
      let $set = {
        active,
        updated
      }
  
      // check if this is a delete query
      const deleteQuery = update_criteria === 'delete';

      // collect info on all deleted items
      const pagesToDelete = await db.Pages.find({ _id: {$in: list_id_arr} }).lean()
      const permalink_arr = pagesToDelete.map(page => page.permalink)
  
      // change update config based on values passed in by user
      if (update_criteria == "template") $set = {
        template: update_value,
        updated
      }
  
      // define db query based on update criteria
      const Query = deleteQuery ? db.Pages.deleteMany({
        _id: {
          $in: list_id_arr
        }
      }) : db.Pages.updateMany({
        _id: {
          $in: list_id_arr
        }
      }, {
        $set
      })

      // conduct bulk edit of pages in db ...
      await Query

      // if this is not a delete query, respond now with default success message
      if (!deleteQuery) {
        req.flash(
          'success',
          'Bulk edit successful.'
        )

        return res.send(true)
      }

      // if this is a delete query, conduct deletions of permalinks and metas these pages own
      await db.Permalinks.deleteMany({ owner: {$in: list_id_arr} })
      await db.Permalinks.updateMany({parent: {$in: permalink_arr}}, { $unset: {parent: 1} })
      await db.Meta.deleteMany({ owner: {$in: list_id_arr} })
      // finally set any links that use the deleted posts' routes as a reference to inactive
      await db.Links.updateMany({permalink: {$in: permalink_arr}, is_ref: true}, {active: false})

      req.flash(
        'success',
        'Pages successfully deleted.'
      )

      res.send(true);

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect(`/admin/pages`)
    }
  })

  // DELETE PAGE IMAGE - POST
  // =============================================================
  app.post("/deletepageimage", async (req, res) => {
    try {
      // remove image from page in db
      await db.Pages.updateOne({_id: req.body._id}, { $unset: {image: 1} })

      res.json({
        "response": 'Success.',
        "message": 'Page image successfully deleted.'
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({
        "response": error,
        "message": "Page image not deleted. Error occurred."
      })
    }
  })

  // DELETE PAGE - POST
  // =============================================================
  app.post("/deletepage", async (req, res) => {
    const { _id } = req.body

    try {
      // delete page in db
      const deletedPage = await db.Pages.findOneAndDelete({_id})
      // then delete all associations to page ...
      await db.Permalinks.deleteOne({owner: _id})
      await db.Permalinks.updateMany({parent: deletedPage.permalink}, { $unset: {parent: 1} })
      await db.Meta.deleteOne({owner: _id})
      await db.CustomFields.deleteMany({owner: _id})
      // finally set any links that use this page's route as a reference to inactive
      await db.Links.updateMany({permalink: deletedPage.permalink, is_ref: true}, {active: false})

      req.flash(
        'success',
        'Page successfully deleted.'
      )
      res.redirect('/admin/pages')
      
    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect(`/admin/pages/edit/${_id}`)
    }
  })

}
