module.exports = (app, db) => {

  // Handle all redirect hits
  // =============================================================
  app.all('/*', async (req, res, next) => {
    try {
      const source = req.originalUrl;
      const redirectFound = await db.Redirects.findOne({source, active: true})

      if (!redirectFound) {
        return next()
      }

      const {_id, target, type} = redirectFound

      // count a hit
      await db.Redirects.update({_id}, {$inc: {"hits": 1}})

      res.redirect(type, target)

    } catch (error) {
      console.error(error)
      next()
    }
  })

}