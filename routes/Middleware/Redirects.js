module.exports = (app, db) => {

  // Handle all redirect hits
  // =============================================================
  app.all('/*', async (req, res, next) => {
    try {
      const source = req.originalUrl;
      const redirectFound = await db.Redirects.findOne({source})

      if (!redirectFound) {
        return next()
      }

      const {_id, target} = redirectFound

      await db.Redirects.update({_id}, {$inc: {"hits": 1}})

      res.redirect(target)

    } catch (error) {
      console.error(error)
      next()
    }
  })

}