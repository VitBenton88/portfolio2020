const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for link
const PermalinkSchema = new Schema({
    route: {
      type: String,
      default: '/',
      trim: true,
      unique: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'ownerModel'
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ['Pages', 'Posts']
    },
    parent: {
      type: Schema.ObjectId,
      ref: 'Permalinks',
      autopopulate: true
    },
    sitemap: {
      type: Boolean,
      default: false
    },
    created: {
      type: Date,
      default: Date.now
    }
  })

  PermalinkSchema.virtual('full').get(function() {
    let route = this.route
    const buildRoute = (permalink) => {
      if (permalink.parent) {
        route = `${permalink.parent.route}/${route}`
        buildRoute(permalink.parent)
      }
    }

    buildRoute(this)
    return route

  })
  
// This creates our model from the above schema, using mongoose's model method
PermalinkSchema.plugin(require('mongoose-autopopulate'))
const Permalinks = mongoose.model("Permalinks", PermalinkSchema)

// Export the Permalinks model
module.exports = Permalinks