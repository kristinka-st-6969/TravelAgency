const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Настройка multer для загрузки аватаров
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Только изображения!'));
  }
});

// Получение всех пользователей (только для админа)
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

// Получение профиля текущего пользователя
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении профиля' });
  }
});

// Обновление профиля
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email уже используется' });
      }
    }

    await user.update({ name, email });
    res.json({ message: 'Профиль обновлен' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
});

// Загрузка аватара
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const user = await User.findByPk(req.user.id);
    await user.update({ avatar: `/uploads/avatars/${req.file.filename}` });
    res.json({ message: 'Аватар обновлен', avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при загрузке аватара' });
  }
});

// Изменение пароля
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный текущий пароль' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// Изменение роли пользователя (только для админа)
router.put('/:id/role', auth, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.update({ role });
    res.json({ message: 'Роль пользователя обновлена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении роли' });
  }
});

// Блокировка/разблокировка пользователя (только для админа)
router.put('/:id/block', auth, admin, async (req, res) => {
  console.log('Запрос на блокировку пришёл');
  try {
    console.log('Тело запроса:', req.body);
    const { isBlocked } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.update({ isBlocked });
    res.json({ message: isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса блокировки' });
  }
});


module.exports = router; 