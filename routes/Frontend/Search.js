module.exports = (app, db) => {
  // SEARCH - GET
  // =============================================================
  app.get('/search', async (req, res) => {
    try {
      const {
        menus,
        originalUrl,
        plugins,
        query,
        site_data
      } = req

      const {paged, term} = query

      // query pages with search term
      const Pages = await db.Pages.find({$text: {$search: term} }).populate('permalink')
      // query posts with search term
      const Posts = await db.Posts.find({$text: {$search: term} }).populate('permalink')

      let results = {Pages, Posts}

      if (!Pages.length && !Posts.length) {
        results = []
      }

      res.render('templates/defaults/search', {
        menus,
        originalUrl,
        plugins,
        results,
        term,
        site_data
      })

    } catch (error) {
      console.error(error)
      res.status(500).end()
    }
  })
}