const express = require('express');
const Destination = require('../models/Destination');
const router = express.Router();

// Получить все направления
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить направление
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newDest = await Destination.create({ name });
    res.json(newDest);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить направление
router.put('/:id', async (req, res) => {
  try {
    const dest = await Destination.findByPk(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Не найдено' });
    await dest.update({ name: req.body.name });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить направление
router.delete('/:id', async (req, res) => {
  try {
    const dest = await Destination.findByPk(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Не найдено' });
    await dest.destroy();
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
