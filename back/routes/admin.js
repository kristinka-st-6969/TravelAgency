const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { Op } = require('sequelize');

// Получение статистики
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTours = await Tour.count();
    const totalBookings = await Booking.count();
    const totalRevenue = await Booking.sum('totalPrice', {
      where: { status: 'confirmed' }
    });

    const recentBookings = await Booking.findAll({
      include: [
        { model: Tour, attributes: ['title'] },
        { model: User, attributes: ['name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const popularTours = await Tour.findAll({
      include: [{
        model: Booking,
        attributes: ['numberOfPeople'],
        where: { status: 'confirmed' }
      }],
      attributes: {
        include: [
          [
            sequelize.fn('SUM', sequelize.col('Bookings.numberOfPeople')),
            'totalBookings'
          ]
        ]
      },
      group: ['Tour.id'],
      order: [[sequelize.literal('totalBookings'), 'DESC']],
      limit: 5
    });

    res.json({
      totalUsers,
      totalTours,
      totalBookings,
      totalRevenue,
      recentBookings,
      popularTours
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
});

// Получение списка заблокированных пользователей
router.get('/blocked-users', auth, admin, async (req, res) => {
  try {
    const blockedUsers = await User.findAll({
      where: { isBlocked: true },
      attributes: { exclude: ['password'] }
    });
    res.json(blockedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка заблокированных пользователей' });
  }
});

// Получение списка ожидающих бронирований
router.get('/pending-bookings', auth, admin, async (req, res) => {
  try {
    const pendingBookings = await Booking.findAll({
      where: { status: 'pending' },
      include: [
        { model: Tour, attributes: ['title', 'price'] },
        { model: User, attributes: ['name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(pendingBookings);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка ожидающих бронирований' });
  }
});

// Получение списка туров с низкой загрузкой
router.get('/low-occupancy-tours', auth, admin, async (req, res) => {
  try {
    const tours = await Tour.findAll({
      include: [{
        model: Booking,
        attributes: ['numberOfPeople'],
        where: { status: 'confirmed' }
      }],
      attributes: {
        include: [
          [
            sequelize.fn('SUM', sequelize.col('Bookings.numberOfPeople')),
            'totalBookings'
          ]
        ]
      },
      group: ['Tour.id'],
      having: sequelize.literal('totalBookings < Tour.maxParticipants * 0.3')
    });

    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка туров с низкой загрузкой' });
  }
});

module.exports = router; 