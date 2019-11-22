// Dependencies
// =============================================================
const db = require("../models")

const Permalinks = {
  permalinkExists: (route) => new Promise( async (resolve, reject) => {
    try {
      const permalink = await db.Permalinks.find({ permalink: route })
      if (permalink.length) {
        return resolve(true)
      }
      resolve(false)
    } catch (error) {
      console.error(error)
      reject(new Error(error))
    }
  })
}

// Export the helper function object
module.exports = Permalinks
