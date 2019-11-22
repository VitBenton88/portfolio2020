module.exports = (app, db, Utils) => {

    // ENTRIES PAGE GET
    // =============================================================
    app.get("/admin/contact/entries", async (req, res) => {
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
          const count = await db.Entries.find().count()
          const pageCount = Math.ceil(count / limit)
          // setup query params
          const sortConfig = orderBy ? Utils.Sort.getConfig(orderBy, sort) : {'created': 1}
          const searchParams = search ? {$text: {$search: search} } : {}
    
          // query db
          const entries = await db.Entries.find(searchParams).sort(sortConfig).skip(skip).limit(limit)
          // swap sort after the query if there is an order requested, e.g. desc to asc
          sort = orderBy ? Utils.Sort.swapOrder(sort) : null
    
          res.render("admin/entries", {
            entries,
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

    // VIEW ENTRY PAGE - GET
    // =============================================================
    app.get("/admin/contact/entries/edit/:id", async (req, res) => {
        try {
            const _id = req.params.id
            const site_data = req.site_data
            const sessionUser = {
                username: req.user.username,
                _id: req.user._id
            }
            const entry = await db.Entries.findOneAndUpdate({_id}, {read: true})

            res.render("admin/edit/entry", {
                entry,
                sessionUser,
                site_data,
                layout: "admin"
            })

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect('/admin/contact/entries')
        }
    })

    // UPDATE SEVERAL ENTRIES - POST
    // =============================================================
    app.post("/updateentriesmulti", async (req, res) => {
        try {
            const {
                list_id_arr,
                update_criteria,
                update_value
            } = req.body
    
            // check if this is a delete query
            const deleteQuery = update_criteria === 'delete';
    
            // define db query based on update criteria
            const Query = deleteQuery ? db.Entries.deleteMany({
                _id: {
                    $in: list_id_arr
                }
            }) : db.Entries.updateMany({
                _id: {
                    $in: list_id_arr
                }
            }, {
                $set
            })
            
            // fire db query
            await Query

            let flashMsg = 'Bulk edit successful.'

            if (deleteQuery) {
                flashMsg = 'Entries successfully deleted.'
                // pull entried from any form that store it
                await db.Forms.updateMany({entries: {$in: list_id_arr} }, {$pull: {entries: {$in: list_id_arr} } })
            }

            req.flash('success', flashMsg)
            res.send(true);

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect(`/admin/contact/entries`)
        }
    })

    // DELETE ENTRY - POST
    // =============================================================
    app.post("/deleteentry", async (req, res) => {
        const {_id} = req.body
        try {
            // delete entry in db
            await db.Entries.deleteOne({_id})
            // pull entried from any form that store it
            await db.Forms.updateMany({entries: {$in: _id} }, {$pull: {entries: {$in: _id} } })

            req.flash(
                'success',
                'Entry successfully deleted.'
            )
            res.redirect('/admin/contact/entries')

        } catch (error) {
            console.error(error)
            req.flash('error', error.errmsg)
            res.redirect(`/admin/contact/entries`)
        }

    })

}
