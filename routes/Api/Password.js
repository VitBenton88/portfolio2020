module.exports = (app, Utils) => {

    // PROVIDE STRONG PASSWORD
    // =============================================================
    app.get("/api/password", (req, res) => {        
        try {
            const { lower, upper, number, symbol, length } = req.body
            const password = Utils.Password.generate(lower, upper, number, symbol, length)
            // respond to client
            res.status(200).json(password)

        } catch (error) {
            console.error(error)
            res.status(500).json({
                "response": error,
                "message": "Error occurred while fetching a password."
            })
        }
    })
}