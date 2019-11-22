const LocalStrategy = require('passport-local').Strategy
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

//User Model
const db = require("../models")

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({usernameField: 'username'}, async (username, password, done) => {
            try {
                // lookup user
                const user = await db.Users.findOne({username})
                // if user does not exist, reject
                if (!user) {
                    return done(null, false, { message: 'That username is not registered.' })
                }
                
                // compare user
                const isMatch = await bcrypt.compare(password, user.password)
                
                if (!isMatch) {
                    //Decline password entered if no match
                    return done(null, false, { message: 'Incorrect password.' })
                }

                //Confirm correct password was entered
                done(null, user)

            } catch (error) {
                console.error(error)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
      
    passport.deserializeUser((id, done) => {
        db.Users.findById(id, (err, user) => {
            done(err, user)
        })
    })
}