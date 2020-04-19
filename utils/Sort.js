const Sort = {
	getConfig: (orderBy, sort) => {
		const config = {}
		config[orderBy] = sort
		return config
	},

	swapOrder: (sort) => sort == 'asc' ? 'desc' : 'asc'
}

// Export the helper function object
module.exports = Sort