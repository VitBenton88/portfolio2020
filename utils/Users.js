// Dependencies
// =============================================================
const db = require("../models")

const Users = {
  onlyOneAdmin: (_id) => new Promise(async (resolve, reject) => {
    try {
      const users = await db.Users.find()
      let adminUserCount = 0
      let userIsAdmin = false

      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "Administrator") {
          adminUserCount++
          if (users[i]._id == _id) {
            userIsAdmin = true;
          };
        };
      }
      if (adminUserCount < 2 && userIsAdmin) {
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
module.exports = Users