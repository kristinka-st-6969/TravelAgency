import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Profile.css';
import UserIcon from "../images/user-icon_blue.svg";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const [value, setValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { user } = useSelector((state) => state.auth);

  // Для модалки
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    type: '', // 'profile', 'password', 'cancelBooking'
    id: null, // id бронирования если нужно
    message: '', // текст уведомления
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email
      });
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (index) => {
    setValue(index);
    setError(null);
    setSuccess(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openModal = (type, options = {}) => {
    setModalData({ type, ...options });
    setShowModal(true);
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/profile`, {
        name: formData.name,
        email: formData.email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Профиль успешно обновлен');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при обновлении профиля');
      setSuccess(false);
    } finally {
      setShowModal(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setShowModal(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Пароль успешно обновлен');
      setError(null);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при обновлении пароля');
      setSuccess(false);
    } finally {
      setShowModal(false);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.filter((booking) => booking.id !== id));
      setSuccess("Бронирование успешно отменено");
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Ошибка при отмене бронирования");
      setSuccess(false);
    } finally {
      setShowModal(false);
    }
  };

  const statusTranslations = {
    pending: "В ожидании",
    confirmed: "Подтверждено",
    cancelled: "Отменено"
  };

  const getStatusText = (status) => statusTranslations[status] || status;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container-profile">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="grid-profile">
          <div className="profile-card">
            <img src={user?.avatar || UserIcon} alt={user?.name} className="avatar-profile" />
            <h2>{user?.name}</h2>
            <p className="email">{user?.email}</p>
          </div>

          <div className="profile-content">
            <div className="tabs">
              <button className={value === 0 ? 'active' : ''} onClick={() => handleTabChange(0)}>Профиль</button>
              <button className={value === 1 ? 'active' : ''} onClick={() => handleTabChange(1)}>Бронирования</button>
              <button className={value === 2 ? 'active' : ''} onClick={() => handleTabChange(2)}>Безопасность</button>
            </div>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            {value === 0 && (
              <form onSubmit={(e) => {
                e.preventDefault();

                // Проверка, изменил ли пользователь что-то
                if (formData.name === user.name && formData.email === user.email) {
                  setError("Сначала внесите изменения, чтобы сохранить их");
                  setSuccess(false);
                  return;
                }

                // Если есть изменения, открываем модальное окно для подтверждения
                openModal('profile', { message: 'Вы уверены, что хотите сохранить изменения в профиле?' });
              }}>
                <input type="text" name="name" placeholder="Имя" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <button type="submit" className="primary-btn">Сохранить изменения</button>
              </form>
            )}

            {value === 1 && (
              <div>
                {bookings.length === 0 ? <p>У вас пока нет бронирований</p> : bookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <h3>{booking.Tour.title}</h3>
                    <p>Статус: {getStatusText(booking.status)}</p>
                    <p>Дата: {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p>Количество человек: {booking.numberOfPeople}</p>
                    <p>Общая стоимость: {booking.totalPrice} ₽</p>

                    {booking.status !== "cancelled" && (
                      <button className="secondary-btn" onClick={() => openModal('cancelBooking', { id: booking.id, message: 'Вы уверены, что хотите отменить это бронирование?' })}>
                        Отменить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {value === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); openModal('password', { message: 'Вы уверены, что хотите изменить пароль?' }); }}>
                <input type="password" name="currentPassword" placeholder="Текущий пароль" value={formData.currentPassword} onChange={handleChange} required />
                <input type="password" name="newPassword" placeholder="Новый пароль" value={formData.newPassword} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Подтвердите новый пароль" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="submit" className="primary-btn">Изменить пароль</button>
              </form>
            )}
          </div>
        </div>
      </motion.div>

      {/* Модальное окно */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="mb-5">{modalData.message}</h3>
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    // Если модалка для профиля, сбрасываем изменения
                    if (modalData.type === 'profile') {
                      setFormData({
                        ...formData,
                        name: user.name,
                        email: user.email
                      });
                    }
                    setShowModal(false);
                  }}
                >
                  Отмена
                </button>
                <button
                  className="confirm-btn"
                  onClick={() => {
                    if (modalData.type === 'profile') handleProfileUpdate();
                    else if (modalData.type === 'password') handlePasswordUpdate();
                    else if (modalData.type === 'cancelBooking') handleCancelBooking(modalData.id);
                  }}
                >
                  Подтвердить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;
