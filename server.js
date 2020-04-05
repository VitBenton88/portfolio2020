// Dependencies
// =============================================================
const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const favicon = require('serve-favicon')
const fileUpload = require('express-fileupload')
const flash = require('connect-flash')
const helpers = require('handlebars-helpers')()
const analogHelpers = require('./config/handlebarsHelpers.js')
const database = require('./config/db')
const Recaptcha = require('express-recaptcha').RecaptchaV3
const passport = require('passport')
const path = require("path")
const session = require('express-session')
const {
  ensureAuthenticated
} = require('./config/auth')
const slugify = require('url-slug')
const validator = require('validator')

// require all models
// =============================================================
const db = require("./models")

// Passport Config
require('./config/passport')(passport)

// load environment variables
// =============================================================
dotenv.config()

// check for production
// =============================================================
const production = process.env.NODE_ENV == "production"

// Sets up the Express app
// =============================================================
const app = express()
let PORT = process.env.PORT || 3000

// sets up the Express app with File Uploader, limit to 8 MB
// =============================================================
app.use(fileUpload({
  limits: {
    fileSize: 8 * 1024 * 1024
  },
}))

// Handlebars Config
// =============================================================
const hbs = exphbs.create({
  defaultLayout: 'frontend',
  helpers: analogHelpers
})

// sets up the Express app with Handlebars
// =============================================================
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// sets up cookies with the Express App
// =============================================================
app.use(cookieParser('keyboardCats'))

// sets up the Express app to use session
// =============================================================
app.use(session({
  secret: 'keyboardCats',
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 3600000
  }
}))

// Sets up Passport middleware
// =============================================================
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash and setup global variables to be passed into every view
// =============================================================
app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// sets up the Express app to handle data parsing
// =============================================================
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}))
app.use(bodyParser.text())
app.use(bodyParser.json({
  limit: '50mb',
  type: "application/vnd.api+json"
}))

// make sure favicon is served properly
// =============================================================
app.use(favicon(path.join(__dirname, 'public', 'assets/favicon.png')))

// apply production settings
// =============================================================
if (production) {
  // compress responses
  app.use(compression())
  // permit access to public file
  app.use(express.static(path.join(__dirname, '/public'), {
    maxage: '1y'
  }))
  // set proxy for identifying user's IP address
  app.set('trust proxy', true)
  // cache templates
  app.enable('view cache');
} else {
  //load environment variables
  dotenv.config()
  // permit access to public file
  app.use(express.static(path.join(__dirname, '/public')))
}

// connect to the database
// =============================================================
database.connect()

// require all utility functions
// =============================================================
const Utils = require("./utils")

// import Analog Middleware
// =============================================================
require("./routes/Middleware")(app, db, ensureAuthenticated, Recaptcha)

// import Analog Plugins
// =============================================================
require("./routes/Plugins")(app, db, Utils)

// import API Routes
// =============================================================
require("./routes/Api")(app, db)

// import Frontend Routes
// =============================================================
require("./routes/Frontend")(app, bcrypt, db, passport, Recaptcha, Utils, validator)

// import Admin Routes
// =============================================================
require("./routes/Admin")(app, bcrypt, db, slugify, Utils, validator)

// setup 404 handling
// =============================================================
app.use( async (req, res) => {
  try {
      const {
          menus,
          originalUrl,
          site_data
      } = req
      
      await db.PagesNotFound.update({ source: originalUrl }, { source: originalUrl, $inc: { "hits": 1 }}, { upsert: true })
      
      res.status(404).render('templates/defaults/404', {
          menus,
          site_data
      })

  } catch (error) {
      console.error(error)
      res.status(500).end()
  }
})

// starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`)
})