module.exports = (app) => {

    // PROVIDE SITE DATA
    // =============================================================
    app.get("/api/analog/sitedata", (req, res) => {        
        try {
            const { site_data } = req
            // respond to client
            res.status(200).json(site_data)
            
        } catch (error) {
            console.error(error)
            res.status(500).json({
                "response": error,
                "message": "Error occurred while fetching site data."
            })
        }
    })
}