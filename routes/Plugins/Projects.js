module.exports = (app, db) => {

    // Pass plugin to every route
    // =============================================================
    app.all('/*', async (req, res, next) => {
        const { originalUrl } = req

        try {
            if ( originalUrl == "/" ) {
                const projects = { bml: [], webApps: [] }
                const path = 'associations'
                const match = { active: true }
                const options = { sort: { published : -1 } }
                const populate = { path, match, options}
    
                const bml_projects_query = await db.Terms.findOne({ name: 'BML' }).populate(populate)
                const web_projects_query = await db.Terms.findOne({ name: 'Web App' }).populate(populate)
                const bml_projects = bml_projects_query.associations
                const web_projects = web_projects_query.associations
        
                for (let i = 0; i < bml_projects.length; i++) {
                    const project = bml_projects[i]
                    projects.bml.push( project.toObject({ getters: true }) )
                }
        
                for (let i = 0; i < web_projects.length; i++) {
                    const project = web_projects[i]
                    projects.webApps.push( project.toObject({ getters: true }) )
                }
        
                req.plugins.projects = projects
            }
        } catch (error) {
            console.error(error)
        } finally {
            next()
        }
    })

}