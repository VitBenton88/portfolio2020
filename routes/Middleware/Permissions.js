module.exports = (app) => {

  // Reject all put, post, and delete methods if user has 'visitor' role
  // =============================================================
  app.all("*", async (req, res, next) => {
    const {
      headers,
      method,
      originalUrl,
      user
  } = req

  const {referer} = headers

    try {
      // check all non-GET requests comging from users without admin/user permissions and deny them
      // 'Visitor' roles cannot update data
      if (method !== "GET" && originalUrl !== '/logout') {
        if (referer.includes('/admin') && user.role !== "Administrator") {
          req.flash('error', 'Your user permissions do not allow for updating content.')
          return res.redirect(referer)
        }

      }
      // pass route on ...
      next()

    } catch (error) {
      console.log(error)
      res.status(403).end();
    }
  })

}