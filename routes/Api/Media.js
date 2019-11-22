module.exports = (app, db) => {

    // SEARCH MEDIA REQUEST
    // =============================================================
    app.get("/api/media/search/:term", async (req, res) => {
      try {
        // capture search term from params
        const term = req.params.term
        
        // query db for media
        const media = await db.Media.find({$text: {$search: term} }).lean()
      
        // respond to client
        res.status(200).json(media)
        
      } catch (error) {
        console.error(error)
        res.status(500).json({
          "response": error,
          "message": "Error occurred while fetching media."
        })
      }
    })

    // SINGLE MEDIA REQUEST
    // =============================================================
    app.get("/api/media/:id?", async (req, res) => {
      try {
          // capture id from params
          const _ids = req.params.id
          // convert id to array incase there are several
          const _ids_Arr = _ids ? _ids.split(',') : undefined

          // query db for media (when an id(s) is provided, only query for that id)
          const media = _ids ? await db.Media.find({_id: {$in: _ids_Arr}}).lean() : await db.Media.find().lean()
      
        // respond to client
        res.status(200).json(media)
        
      } catch (error) {
        console.error(error)
        res.status(500).json({
          "response": error,
          "message": "Error occurred while fetching media."
        })
      }
    })

}