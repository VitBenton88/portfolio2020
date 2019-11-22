module.exports = (app, db) => {

    // SEARCH POSTS REQUEST
    // =============================================================
    app.get("/api/search/pages/:term?", async (req, res) => {
        try {
          // capture search term from params
          const term = req.params.term
          
          // query db for pages
          const page = await db.Pages.find({$text: {$search: term} }).lean()
        
          // respond to client
          res.status(200).json(page)
          
        } catch (error) { 
          console.error(error)
          res.status(500).json({
            "response": error,
            "message": "Error occurred while fetching pages."
          })
        }
      })

    // SINGLE FORM REQUEST
    // =============================================================
    app.get("/api/pages/:id?", async (req, res) => {    
      try {
          // capture id from params
          const _ids = req.params.id
          // convert id to array incase there are several
          const _ids_Arr = _ids ? _ids.split(',') : undefined

          // query db for pages (when an id(s) is provided, only query for that id)
          const pages = _ids ? await db.Pages.find({_id: {$in: _ids_Arr}}).lean() : await db.Pages.find().lean()
      
          // respond to client
          res.status(200).json(pages)
          
      } catch (error) {
          console.error(error)
          res.status(500).json({
          "response": error,
          "message": "Error occurred while fetching pages."
          })
      }
  })
}