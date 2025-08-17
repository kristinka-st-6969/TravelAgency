const User = require('./User');
const Tour = require('./Tour');
const Booking = require('./Booking');

// Определение связей
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Tour.hasMany(Booking, { foreignKey: 'tourId' });
Booking.belongsTo(Tour, { foreignKey: 'tourId' });

module.exports = {
  User,
  Tour,
  Booking
}; 