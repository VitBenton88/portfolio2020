// Dependencies
// =============================================================
const db = require("../models")
const os = require("os")
const { createSitemap } = require('sitemap')

const Sitemap = {
  generate: (site_data) => new Promise(async (resolve, reject) => {
    try {
      if (!site_data) {
        site_data = await db.Analog.findOne()
      }

      const hostname = site_data.settings.address ? site_data.settings.address : os.hostname()
      const sitemapUrls = await db.Permalinks.find({ sitemap: true }).populate('owner')
      const urls = []

      sitemapUrls.forEach(url => {
        const urlObj = {
          url: `${hostname}/${url.full}`,
          lastmodISO: url.owner.updated.toISOString(),
          changefreq: 'daily',
          priority: 0.5
        }

        // add img data if it exists for this page/post
        if (url.owner.image) {
          urlObj['img'] = {
            url: url.owner.image.path,
            caption: url.owner.image.meta.caption,
            title: url.owner.image.meta.alt
          }
        }

        urls.push(urlObj);
      })

      const sitemap = createSitemap({
        hostname,
        cacheTime: 600000,
        urls
      })

      resolve(sitemap)

    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

// Export the helper function object
module.exports = Sitemap