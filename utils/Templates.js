// Dependencies
// =============================================================
const fs = require('fs')

const Templates = {
	getAll: (_id) => new Promise((resolve, reject) => {
		const templatesRead = fs.readdirSync("views/templates/").filter(file => file.includes(".handlebars"))
		const templatesCopy = [...templatesRead]
		const templates = templatesCopy.map( template => template.replace('.handlebars','') );
		resolve(templates)
	})
}

module.exports = Templates