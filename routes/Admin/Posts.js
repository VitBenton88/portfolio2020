module.exports = (app, db, slugify, Utils) => {

  // POSTS - GET
  // =============================================================
  app.get("/admin/posts", async (req, res) => {
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
  
      //determine offset in query by current page in pagination
      const skip = paged > 0 ? ((paged - 1) * limit) : 0

      // get templated for user to select
      const templates = await Utils.Templates.getAll()

      // get query count for pagination
      const count = await db.Posts.find().count()
      const pageCount = Math.ceil(count / limit)
      // setup query params
      const sortConfig = orderBy ? Utils.Sort.getConfig(orderBy, sort) : {'created': 1}
      const searchParams = search ? {$text: {$search: search} } : {}

      // query db
      const posts = await db.Posts.find(searchParams).sort(sortConfig).skip(skip).limit(limit).populate('permalink')
      // swap sort after the query if there is an order requested, e.g. desc to asc
      sort = orderBy ? Utils.Sort.swapOrder(sort) : null

      res.render("admin/posts", {
        limit,
        orderBy,
        pageCount,
        paged,
        posts,
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

  // ADD POST PAGE - GET
  // =============================================================
  app.get("/admin/posts/add", async (req, res) => {
    try {
      const {
        site_data,
        user
      } = req
  
      const sessionUser = {
        username: user.username,
        _id: user._id
      }
      
      const templates = await Utils.Templates.getAll()
      const taxonomies = await db.Taxonomies.find()
      const forms = await db.Forms.find()

      res.render("admin/add/post", {
        forms,
        sessionUser,
        site_data,
        taxonomies,
        templates,
        layout: "admin"
      })
      
    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/posts')
    }
  })

  // EDIT POST PAGE - GET
  // =============================================================
  app.get("/admin/posts/edit/:id", async (req, res) => {
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
      
      // collect data for render method
      const post = await db.Posts.findById({_id: params.id}).populate('permalink')
      const templates = await Utils.Templates.getAll()
      const taxonomies = await db.Taxonomies.find()
      const forms = await db.Forms.find()

      res.render("admin/edit/post", {
        forms,
        post,
        site_data,
        taxonomies,
        templates,
        sessionUser,
        layout: "admin"
      })
      
    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect('/admin/posts')
    }
  })

  // ADD POST - POST
  // =============================================================
  app.post("/addpost", async (req, res) => {
    const {
      body,
      user
    } = req

    let {
      active,
      content,
      forms,
      image,
      metaTitle,
      metaDescription,
      private,
      published,
      sitemap,
      taxonomies,
      template,
      title
    } = body

    try {
      // basic validation
      if (!template || !title) {
        throw new Error('Please fill out all fields when adding a post.')
      }

      // format fields for db
      published = published ? new Date(published) : new Date()
      active = active == "on" ? true : false
      private = private == "on" ? true : false
      sitemap = sitemap == "on" ? true : false
      image = image === '' ? null : image
      const author = user._id
      let route = slugify(title)

      // check if provided permalink already exists before post is created
      const permalinkExists = await Utils.Permalinks.permalinkExists(route)

      if (permalinkExists) {
        route = `${route}2`
      }

      // create new post in db
      const createdPost = await db.Posts.create({active, author, content, forms, image, private, published, taxonomies, template, title})
      const ownerModel = 'Posts'
      const owner = createdPost.id

      // then create its permalink in the Permalinks document ...
      const createdPermalink = await db.Permalinks.create({route, owner, ownerModel, sitemap})
      const permalink = createdPermalink.id

      // then create its meta in the meta document ...
      const createdMeta = await db.Meta.create({title: metaTitle, description: metaDescription, owner, ownerModel})
      const meta = createdMeta.id

      // then add this post to the terms it is classified under ...
      await db.Terms.updateMany({ _id: {$in: taxonomies} }, {$push: {associations: owner} })

      // finally go back and assign that permalink and meta to the newly created post
      await db.Posts.updateOne({_id: owner}, {permalink, meta})

      req.flash(
        'success',
        'Post successfully added.'
      )
      res.redirect(`/admin/posts/edit/${owner}`)

    } catch (error) {
      console.error(error)
      let errorMessage = error.errmsg || error.toString()
      req.flash('error', errorMessage)
      res.redirect('/admin/posts')
    }
  })

  // UPDATE POST - POST
  // =============================================================
  app.post("/updatepost", async (req, res) => {
    let {
      _id,
      active,
      content,
      forms,
      image,
      metaTitle,
      metaDescription,
      originalRoute,
      private,
      published,
      route,
      sitemap,
      taxonomies,
      template,
      title
    } = req.body

    try {
      // basic validation
      if (!template || !title || !route) {
        throw new Error('Please fill out all required fields when editing a post.')
      }

      // format fields for db
      published = published ? new Date(published) : undefined
      active = active == "on" ? true : false
      private = private == "on" ? true : false
      sitemap = sitemap == "on" ? true : false
      image = image === '' ? null : image
      const updated = Date.now()

      // make sure route is in slug format
      route = slugify(route)

      // update post in db
      const updatedPost = await db.Posts.findOneAndUpdate({_id}, {active, content, forms, image, private, published, taxonomies, template, title, updated})
      const owner = updatedPost.id

      // then update the permalink in the Permalinks document ...
      const updatedPermalink = await db.Permalinks.findOneAndUpdate({owner}, {route, sitemap}, {new: true})
      // then update the meta in the meta document ...
      await db.Meta.updateOne({owner}, {description: metaDescription, title: metaTitle})
      // finally update the terms so that associate to the post updates
      await db.Terms.updateMany({ _id: {$in: taxonomies} }, {$push: {associations: _id} })
      // finally update any links that use this post's route (that were created as a reference to an existing page)
      await db.Links.updateMany({route: `/${originalRoute}`, is_ref: true}, {route: `/${updatedPermalink.full}`})

      req.flash(
        'success',
        'Post successfully updated.'
      )
      res.redirect(`/admin/posts/edit/${_id}`)
      
    } catch (error) {
      console.error(error)

      let errorMessage = error.errmsg || error.toString()
      // if this is a dup error, notify the user about it
      if (error.code == 11000) {
        if (errorMessage.includes('route')) {
          errorMessage = `The permalink "${route}" is already taken.`
        }
      }

      req.flash('error', errorMessage)
      res.redirect(`/admin/posts/edit/${_id}`)
    }
  })

  // UPDATE SEVERAL POSTS - POST
  // =============================================================
  app.post("/updatepostmulti", async (req, res) => {
    try {
      const {
        list_id_arr,
        update_criteria,
        update_value
      } = req.body
  
      const active = (update_value === 'active')
      const updated = Date.now()
  
      // check if this is a delete query
      const deleteQuery = update_criteria === 'delete';

      // collect info on all deleted items
      const postsToDelete = await db.Posts.find({ _id: {$in: list_id_arr} }).lean()
      const permalink_arr = postsToDelete.map(post => post.permalink)
  
      // change update config based on values passed in by user
      $set = update_criteria == "template" ? {template: update_value, updated} : {active, updated}

    // define db query based on update criteria
    const Query = deleteQuery ? db.Posts.deleteMany({
      _id: {
        $in: list_id_arr
      }
    }) : db.Posts.updateMany({
      _id: {
        $in: list_id_arr
      }
    }, {
      $set
    })

    // fire db query ...
    await Query

    // if this is not a delete query, respond here with appropriate success message
    if (!deleteQuery) {
      req.flash(
        'success',
        'Bulk edit successful.'
      )

      return res.send(true)
    }

    // if this is a delete query, delete all associations with the deleted posts ...
    await db.Permalinks.deleteMany({ owner: {$in: list_id_arr} })
    await db.Permalinks.updateMany({parent: {$in: permalink_arr}}, { $unset: {parent: 1} })
    await db.Meta.deleteMany({ owner: {$in: list_id_arr} })
    await db.Terms.updateMany({associations: {$in: list_id_arr} }, {$pull: {associations: {$in: list_id_arr} } })
    // finally set any links that use the deleted posts' routes as a reference to inactive
    await db.Links.updateMany({permalink: {$in: permalink_arr}, is_ref: true}, {active: false})

    req.flash(
      'success',
      'Posts successfully deleted.'
    )

    res.send(true)

    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect(`/admin/posts`)
    }
  })

  // DELETE POST IMAGE - POST
  // =============================================================
  app.post("/deletepostimage", async (req, res) => {
    try {
      // remove image from post in db
      await db.Posts.updateOne({_id: req.body._id}, { $unset: {image: 1} })

      res.json({
        "response": 'Success.',
        "message": 'Post image successfully deleted.'
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({
        "response": error,
        "message": "Post image not deleted. Error occurred."
      })
    }
  })

  // DELETE POST - POST
  // =============================================================
  app.post("/deletepost", async (req, res) => {
    const { _id } = req.body

    try {
      // delete post from db ...
      const deletedPost = await db.Posts.findOneAndDelete({_id})
      // then delete all associations to post ...
      await db.Permalinks.deleteOne({ owner: _id })
      await db.Permalinks.updateMany({parent: deletedPost.permalink}, { $unset: {parent: 1} })
      await db.Meta.deleteOne({ owner: _id })
      await db.Terms.updateMany({associations: {$in: _id} }, {$pull: {associations: {$in: _id} } })
      await db.CustomFields.deleteMany({ owner: _id })
      // finally set any links that use this post's route as a reference to inactive
      await db.Links.updateMany({permalink: deletedPost.permalink, is_ref: true}, {active: false})

      req.flash(
        'success',
        'Post successfully deleted.'
      )

      res.redirect('/admin/posts')
      
    } catch (error) {
      console.error(error)
      req.flash('error', error.errmsg)
      res.redirect(`/admin/posts/edit/${_id}`)
    }
  })

}
