const Sort = {
  getConfig: (orderBy, sort) => {
    const config = {}
    config[orderBy] = sort
    return config
  },

  swapOrder: (sort) => {
    if (sort == 'asc') {
      return 'desc'
    }

    return 'asc'
  }
}

// Export the helper function object
module.exports = Sort