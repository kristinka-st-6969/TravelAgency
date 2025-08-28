const express = require('express');
const multer = require('multer');
const path = require('path');
const Tour = require('../models/Tour');
const {Op} = require('sequelize')

const router = express.Router();

// Настройка multer для загрузки файлов (картинок)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tours');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// CREATE тур с картинками
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      destination,
      startDate,
      endDate,
      maxParticipants,
      isActive
    } = req.body;

    // Пути к файлам
    const images = req.files ? req.files.map(file => `/uploads/tours/${file.filename}`) : [];

    const newTour = await Tour.create({
      title,
      description,
      price,
      duration,
      destination,
      startDate,
      endDate,
      maxParticipants,
      isActive: isActive !== undefined ? isActive : true,
      images
    });

    res.status(201).json(newTour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ - получить все туры с поиском
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      // Номер страницы
    const limit = parseInt(req.query.limit) || 6;    // Кол-во на страницу
    const search = req.query.search || '';           // Поисковый запрос
    const offset = (page - 1) * limit;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';


    // Условие для поиска
    const whereCondition = {};
    if (search) {
      const { Op } = require('sequelize');
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { destination: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Tour.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [[sortField, sortOrder]]
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      tours: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// READ - получить тур по id
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE тур (редактировать данные, картинки)
// Если нужно заменить картинки, можно загружать новые (или добавить логику удаления старых)
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const {
      title,
      description,
      price,
      duration,
      destination,
      startDate,
      endDate,
      maxParticipants,
      isActive
    } = req.body;

    let images = tour.images;

    // Если пришли новые картинки, заменяем старые (можно поменять логику)
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/tours/${file.filename}`);
    }

    await tour.update({
      title,
      description,
      price,
      duration,
      destination,
      startDate,
      endDate,
      maxParticipants,
      isActive,
      images
    });

    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE тур
router.delete('/:id', async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    await tour.destroy();
    res.json({ message: 'Tour deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
