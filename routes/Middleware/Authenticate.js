module.exports = (app, ensureAuthenticated) => {

  // Authenticate on all admin routes
  // =============================================================
  app.all('/admin/*', ensureAuthenticated)

}