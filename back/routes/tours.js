// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');
// const Tour = require('../models/Tour');

// // Настройка multer для загрузки изображений туров
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/tours');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
//     if (extname && mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error('Только изображения!'));
//   }
// });

// // Получение списка туров с пагинацией и поиском
// router.get('/', async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
//     const offset = (page - 1) * limit;

//     const where = {};
//     if (search) {
//       where[Op.or] = [
//         { title: { [Op.like]: `%${search}%` } },
//         { description: { [Op.like]: `%${search}%` } },
//         { destination: { [Op.like]: `%${search}%` } }
//       ];
//     }

//     const { count, rows: tours } = await Tour.findAndCountAll({
//       where,
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order: [['createdAt', 'DESC']]
//     });

//     res.json({
//       tours,
//       total: count,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(count / limit)
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка при получении туров' });
//   }
// });

// // Получение тура по ID
// router.get('/:id', async (req, res) => {
//   try {
//     const tour = await Tour.findByPk(req.params.id);
//     if (!tour) {
//       return res.status(404).json({ message: 'Тур не найден' });
//     }
//     res.json(tour);
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка при получении тура' });
//   }
// });

// // Создание нового тура (только для админа)
// router.post('/', upload.single('images'), async (req, res) => {
//   try {
//     const {
//       title,
//       destination,
//       price,
//       description,
//       startDate,
//       endDate,
//       maxParticipants,
//       isActive,
//       duration
//     } = req.body;

//     const image = req.file ? req.file.filename : null;

//     const newTour = new Tour({
//       title,
//       destination,
//       price,
//       description,
//       startDate,
//       endDate,
//       maxParticipants,
//       isActive,
//       duration,
//       images
//     });

//     await newTour.save();
//     res.status(201).json({ message: 'Тур добавлен', tour: newTour });
//   } catch (error) {
//     console.error('Ошибка при добавлении тура:', error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// });

// // Обновление тура (только для админа)
// router.put('/:id', auth, admin, upload.array('images', 5), async (req, res) => {
//   try {
//     const tour = await Tour.findByPk(req.params.id);
//     if (!tour) {
//       return res.status(404).json({ message: 'Тур не найден' });
//     }

//     const tourData = req.body;
//     const newImages = req.files ? req.files.map(file => `/uploads/tours/${file.filename}`) : [];
    
//     // Если есть новые изображения, добавляем их к существующим
//     if (newImages.length > 0) {
//       tourData.images = [...(tour.images || []), ...newImages];
//     }

//     await tour.update(tourData);
//     res.json(tour);
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка при обновлении тура' });
//   }
// });

// // Удаление тура (только для админа)
// router.delete('/:id', auth, admin, async (req, res) => {
//   try {
//     const tour = await Tour.findByPk(req.params.id);
//     if (!tour) {
//       return res.status(404).json({ message: 'Тур не найден' });
//     }

//     await tour.destroy();
//     res.json({ message: 'Тур успешно удален' });
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка при удалении тура' });
//   }
// });

// // Удаление изображения тура (только для админа)
// router.delete('/:id/images/:imageIndex', auth, admin, async (req, res) => {
//   try {
//     const tour = await Tour.findByPk(req.params.id);
//     if (!tour) {
//       return res.status(404).json({ message: 'Тур не найден' });
//     }

//     const imageIndex = parseInt(req.params.imageIndex);
//     if (!tour.images || imageIndex >= tour.images.length) {
//       return res.status(404).json({ message: 'Изображение не найдено' });
//     }

//     const images = [...tour.images];
//     images.splice(imageIndex, 1);
//     await tour.update({ images });

//     res.json({ message: 'Изображение удалено' });
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка при удалении изображения' });
//   }
// });

// module.exports = router; 




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
      order: [['createdAt', 'DESC']] // По умолчанию сортировка
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
