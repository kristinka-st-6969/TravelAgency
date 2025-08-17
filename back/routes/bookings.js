const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Booking, Tour, User } = require('../models');
const { Op } = require('sequelize');
const { sendMail } = require('../utils/mailer');

// Получение всех бронирований (только для админа)
router.get('/', auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { 
          model: Tour,
          attributes: ['title', 'price', 'destination', 'images']
        },
        { 
          model: User,
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    res.status(500).json({ message: 'Ошибка при получении бронирований' });
  }
});

// Получение бронирований текущего пользователя
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: Tour,
          attributes: ['title', 'price', 'destination', 'images']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error.message, error.stack);
    res.status(500).json({ message: 'Ошибка при получении бронирований' });
  }
});

// Создание нового бронирования
router.post('/', auth, async (req, res) => {
  try {
    const { tourId, numberOfPeople, specialRequests } = req.body;

    const tour = await Tour.findByPk(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Тур не найден' });
    }

    // Проверка доступности мест
    const bookedCount = await Booking.sum('numberOfPeople', {
      where: {
        tourId,
        status: 'confirmed'
      }
    });

    if (bookedCount + numberOfPeople > tour.maxParticipants) {
      return res.status(400).json({ message: 'Недостаточно мест' });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      tourId,
      numberOfPeople,
      specialRequests,
      totalPrice: tour.price * numberOfPeople,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании бронирования' });
  }
});

// Обновление статуса бронирования (только для админа)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    // const booking = await Booking.findByPk(req.params.id);
    const booking = await Booking.findByPk(req.params.id, { include: [{ model: User }] });

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    await booking.update({ status });

    // Отправка письма пользователю
    if (booking.User && booking.User.email) {
      let statusText = '';
      if (status === 'confirmed') statusText = 'подтверждено';
      else if (status === 'cancelled') statusText = 'отменено';
      else statusText = status;
      await sendMail(
        booking.User.email,
        'Статус вашего бронирования изменён',
        `Здравствуйте, ${booking.User.name || ''}!\n\nСтатус вашего бронирования №${booking.id} был изменён на: ${statusText}.`
      );
    }

    res.json(booking);
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error.message, error.stack);
    res.status(500).json({ message: 'Ошибка при обновлении статуса' });
  }
});

// Отмена бронирования
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Проверка прав доступа
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для отмены бронирования' });
    }

    await booking.destroy();
    res.json({ message: 'Бронирование отменено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при отмене бронирования' });
  }
});

module.exports = router; 