module.exports = (app, db) => {

    //Pass plugin to every route
    // =============================================================
    app.all('/*', (req, res, next) => {
        const testObj = { foo: "bar" }

        req.plugins.test = testObj
        next()
    })

}