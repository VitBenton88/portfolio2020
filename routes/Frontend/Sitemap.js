module.exports = (app, Utils) => {
  // SITEMAP - GET
  // =============================================================
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const sitemap = await Utils.Sitemap.generate(req.site_data)
      const xml = sitemap.toXML()
      res.header('Content-Type', 'application/xml')
      res.send(xml)
    } catch (error) {
      console.error(error)
      res.status(500).end()
    }
  })
}