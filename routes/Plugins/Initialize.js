module.exports = (app, db) => {

    // Initialize plugin object in express
    // =============================================================
    app.all('/*', (req, res, next) => {
        req.plugins = {}
        next()
    })
    
}
