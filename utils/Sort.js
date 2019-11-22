const Sort = {
  getConfig: (orderBy, sort) => {
    switch (orderBy) {
      case 'created':
        return {
          'created': sort
        }
        break;
      case 'email':
        return {
          'email': sort
        }
        break;
      case 'hits':
        return {
          'hits': sort
        }
        break;
      case 'homepage':
        return {
          'homepage': sort
        }
        break;
      case 'name':
        return {
          'name': sort
        }
        break;
      case 'published':
        return {
          'published': sort
        }
        break;
      case 'read':
        return {
          'read': sort
        }
        break;
      case 'role':
        return {
          'role': sort
        }
        break;
      case 'slug':
        return {
          'slug': sort
        }
        break;
      case 'source':
        return {
          'source': sort
        }
        break;
      case 'status':
        return {
          'active': sort
        }
        break;
      case 'target':
        return {
          'target': sort
        }
        break;
      case 'template':
        return {
          'template': sort
        }
        break;
      case 'username':
        return {
          'username': sort
        }
        break;
      default:
        return {
          'title': sort
        }
    }
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