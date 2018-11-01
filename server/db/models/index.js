const User = require('./user')
const Location = require('./location')
const Amenities = require('./amenities')
const Orders = require('./orders')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

Location.belongsTo(Amenities)
Amenities.hasOne(Location)
Location.belongsTo(User)
User.hasMany(Location)

User.belongsToMany(Location, {
  through: Orders
})
Location.belongsToMany(User, {
  through: Orders
})

// Location.belongsToMany(User, {through: 'Favs'})

module.exports = {
  User,
  Location,
  Amenities
}
