// Dependencies
// =============================================================
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const db = require("../models")

module.exports = (passport) => {

    passport.use(
        new LocalStrategy({usernameField: 'username'}, async (username, password, done) => {
            try {
                // default error message
                const message = "Incorrect username or password."

                // lookup user
                const user = await db.Users.findOne({username})
                // if user does not exist, reject
                if (!user) {
                    return done(null, false, { message })
                }
                
                // compare user
                const isMatch = await bcrypt.compare(password, user.password)
                
                if (!isMatch) {
                    // decline password entered if no match
                    return done(null, false, { message })
                }

                // confirm correct password was entered
                done(null, user)

            } catch (error) {
                console.error(error)
            }
        })
    )

    passport.serializeUser( (user, done) => {
        done(null, user.id)
    })
      
    passport.deserializeUser( (id, done) => {
        db.Users.findById(id, (err, user) => {
            done(err, user)
        })
    })
    
}