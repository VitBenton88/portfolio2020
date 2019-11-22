module.exports = (app, db) => {

  // Pass menus to every route
  // =============================================================
  app.all('/*', async (req, res, next) => {
    try {
      let menusObj = {}
      const menus = await db.Menus.find()
        .populate({
          path: 'links',
          model: 'Links',
          options: {
            sort: {
              "position": 1
            }
          },
          populate: {
            path: 'submenu',
            model: 'Links',
            options: {
              sort: {
                "sub_position": 1
              }
            }
          }
        })

      menus.forEach(menu => {
        menusObj[menu.slug] = menu
      });

      req.menus = menusObj
      
      next()

    } catch (error) {
      console.error(error)
      next()
    }
  })

}
