module.exports = (app, db, Utils) => {

    // REDIRECTS GET
    // =============================================================
    app.get("/admin/redirects", async (req, res) => {
        try {
          const {
            body,
            originalUrl,
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
          const count = await db.Redirects.find().count()
          const pageCount = Math.ceil(count / limit)
          // setup query params
          const sortConfig = orderBy ? Utils.Sort.getConfig(orderBy, sort) : {'created': 1}
          const searchParams = search ? {$text: {$search: search} } : {}
    
          // query db
          const redirects = await db.Redirects.find(searchParams).sort(sortConfig).skip(skip).limit(limit)
          // swap sort after the query if there is an order requested, e.g. desc to asc
          sort = orderBy ? Utils.Sort.swapOrder(sort) : null
    
          res.render("admin/redirects", {
            limit,
            orderBy,
            originalUrl,
            pageCount,
            paged,
            redirects,
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

    // ADD REDIRECT PAGE - POST
    // =============================================================
    app.post("/addredirect", async (req, res) => {
        try {
            const {
                source,
                target
            } = req.body
    
            // some basic validation, make sure routes start with backslash
            if (source.charAt(0) !== "/" || target.charAt(0) !== "/") {
                throw new Error('Redirect add attempt failed. Source or target does not start with backslash.')
            }
            // some basic validation, make sure source and target are not identical
            if (source === target) {
                throw new Error('Source and target cannot be the same.')
            }

            // create in db
            await db.Redirects.create({source, target})

            req.flash(
                'success',
                'Redirect successfully added.'
            )
            res.redirect('/admin/redirects')

        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('error', errorMessage)
            res.redirect(`/admin/redirects`)
        }
    })

    // UPDATE REDIRECT - POST
    // =============================================================
    app.post("/updateredirect", async (req, res) => {
        try {
            const {
                _id,
                source,
                target
            } = req.body
    
            // some basic validation, make sure routes start with backslash
            if (source.charAt(0) !== "/" || target.charAt(0) !== "/") {
                throw new Error('Redirect add attempt failed. Source or target does not start with backslash.')
            }
            // some basic validation, make sure source and target are not identical
            if (source === target) {
                throw new Error('Source and target cannot be the same.')
            }

            // run db update query
            await db.Redirects.updateOne({_id}, {source, target, hits: 0})

            req.flash(
                'success',
                'Redirect successfully edited.'
            )
            res.redirect(`/admin/redirects`)
            
        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('error', errorMessage)
            res.redirect(`/admin/redirects`)
        }
    })

    // UPDATE SEVERAL REDIRECTS - POST
    // =============================================================
    app.post("/updateredirectsmulti", async (req, res) => {
        try {
            const {
                list_id_arr,
                update_criteria,
                update_value
            } = req.body
    
            // check if this is a delete query
            const deleteQuery = update_criteria === 'delete';
    
            // change update config based on values passed in by user
            if (update_criteria == "target") {
                // some basic validation, make sure targets begin with backslash
                if (update_value.charAt(0) !== "/") {
                    throw new Error('Redirect add attempt failed. Source or target does not start with backslash.')
                }
    
                $set = {
                    target: update_value
                }
            }
    
            // define db query based on update criteria
            const Query = deleteQuery ? db.Redirects.deleteMany({
                _id: {
                    $in: list_id_arr
                }
            }) : db.Redirects.updateMany({
                _id: {
                    $in: list_id_arr
                }
            }, {
                $set
            })
            
            // run db query
            await Query

            const flashMsg = deleteQuery ? 'Redirects successfully deleted.' : 'Bulk edit successful.'

            req.flash('success', flashMsg)
            res.send(true);
            
        } catch (error) {
            console.error(error)
            const errorMessage = error.errmsg || error.toString()
            req.flash('error', errorMessage)
            res.redirect(`/admin/redirects`)
        }
    })

    // DELETE REDIRECT - POST
    // =============================================================
    app.post("/deleteredirect", async (req, res) => {
        try {
            // delete in db
            await db.Redirects.deleteOne({_id: req.body._id})

            req.flash(
                'success',
                'Redirect successfully deleted.'
            )
            res.redirect('/admin/redirects')

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect(`/admin/redirects`)
        }
    })

}
