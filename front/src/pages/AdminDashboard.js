import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Универсальное модальное окно подтверждения
const ConfirmModal = ({ show, message, onConfirm, onCancel }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3>{message}</h3>
          <div className="modal-actions">
            <button className="btn btn-danger" onClick={onCancel}>
              Отмена
            </button>
            <button className="btn btn-primary" onClick={onConfirm}>
              Подтвердить
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Компонент для управления турами
const ToursManagement = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    price: "",
    duration: "",
    destination: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
    isActive: true,
  });
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [destModal, setDestModal] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [newDest, setNewDest] = useState("");
  const [loading, setLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });
  
  // Получение всех туров
  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/tours?page=${page}&limit=${limit}`);
      setTours(res.data.tours);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Ошибка при загрузке туров:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
    fetchDestinations();
  }, [page]);

  const fetchDestinations = async () => {
    try {
      const res = await axios.get(`${API_URL}/destinations`);
      setDestinations(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке направлений:', err);
    }
  };

  const handleAddDest = async () => {
    if (!newDest.trim()) return;
    try {
      await axios.post(`${API_URL}/destinations`, { name: newDest });
      setNewDest("");
      fetchDestinations();
    } catch (error) {
      console.error('Ошибка при добавлении направления:', error);
    }
  };

  const handleDeleteDest = async (id) => {
    try {
      await axios.delete(`${API_URL}/destinations/${id}`);
      fetchDestinations();
    } catch (error) {
      console.error('Ошибка при удалении направления:', error);
    }
  };

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Обработка изменения дат с авторасчетом длительности
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      let updatedForm = { ...prev, [name]: value };

      if (name === "startDate" && updatedForm.endDate && updatedForm.endDate < value) {
        updatedForm.endDate = "";
        updatedForm.duration = "";
      }

      if (updatedForm.startDate && updatedForm.endDate) {
        const start = new Date(updatedForm.startDate);
        const end = new Date(updatedForm.endDate);
        if (end >= start) {
          const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          updatedForm.duration = diff;
        }
      }

      return updatedForm;
    });
  };

  // Обработка выбора картинок
  const handleImagesChange = (e) => {
    setImages(e.target.files);
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/tours/${form.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_URL}/tours`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchTours();
      setModalOpen(false);
    } catch (error) {
      console.error('Ошибка при сохранении тура:', error);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      price: "",
      duration: "",
      destination: "",
      startDate: "",
      endDate: "",
      maxParticipants: "",
      isActive: true,
    });
    setImages([]);
    setEditing(false);
  };

  // Открыть модалку для создания тура
  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  // Открыть модалку для редактирования тура
  const handleEdit = (tour) => {
    setForm({
      id: tour.id,
      title: tour.title,
      description: tour.description,
      price: tour.price,
      duration: tour.duration,
      destination: tour.destination,
      startDate: tour.startDate.split("T")[0],
      endDate: tour.endDate.split("T")[0],
      maxParticipants: tour.maxParticipants,
      isActive: tour.isActive,
    });
    setEditing(true);
    setImages([]);
    setModalOpen(true);
  };

  // Закрыть модалку
  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // Удаление тура
  const handleDelete = async (id) => {
    setConfirmModal({
      show: true,
      message: "Удалить этот тур?",
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/tours/${id}`);
          fetchTours();
        } catch (error) {
          console.error('Ошибка при удалении тура:', error);
        } finally {
          setConfirmModal({ show: false, message: "", onConfirm: null });
        }
      },
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button
          className="btn btn-secondary"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Назад
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        
        <button
          className="btn btn-secondary"
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Далее
        </button>
      </div>
    );
  };

  return (
    <div className="tours-management">
      <ConfirmModal
        show={confirmModal.show}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false, message: "", onConfirm: null })}
      />

      <div className="header">
        <h2>Управление турами</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            Добавить тур
          </button>
          <button className="btn btn-secondary" onClick={() => {
            fetchDestinations();
            setDestModal(true);
          }}>
            Управление направлениями
          </button>
        </div>
      </div>

      {/* Модалка создания/редактирования тура */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? "Редактировать тур" : "Добавить тур"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Название</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Описание</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Цена</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Длительность (дней)</label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Направление</label>
                  <select
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Выберите направление --</option>
                    {destinations.map(dest => (
                      <option key={dest.id} value={dest.name}>{dest.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Дата начала</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Дата окончания</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    min={form.startDate || new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Макс. участников</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={form.maxParticipants}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                    />
                    Активен
                  </label>
                </div>
                <div className="form-group">
                  <label>Загрузить картинки</label>
                  <div className="file-input-wrapper">
                    <span className="file-input-label">Выбрать файлы</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                    />
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="selected-images">
                    {[...images].map((img, i) => (
                      <span key={i} className="image-name">{img.name}</span>
                    ))}
                  </div>
                )}
                <div className="modal-actions">
                  <button type="button" className="btn btn-danger" onClick={handleCloseModal}>
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editing ? "Сохранить" : "Добавить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Модалка управления направлениями */}
      {destModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Управление направлениями</h3>
              <button className="modal-close" onClick={() => setDestModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Новое направление"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDest()}
                />
                <button className="btn btn-primary" onClick={handleAddDest}>
                  Добавить
                </button>
              </div>
              <ul className="destinations-list">
                {destinations.map(dest => (
                  <li key={dest.id}>
                    {dest.name}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteDest(dest.id)}
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Список туров */}
      <div className="tours-list">
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : tours.length === 0 ? (
          <p className="no-data">Туров пока нет.</p>
        ) : (
          <>
            <div className="tours-grid">
              {tours.map((tour) => (
                <div key={tour.id} className="tour-card">
                  <h3>{tour.title}</h3>
                  <p className="tour-description">{tour.description}</p>
                  <div className="tour-details">
                    <p>Цена: {tour.price} ₽</p>
                    <p>Длительность: {tour.duration} дней</p>
                    <p>Направление: {tour.destination}</p>
                    <p>С {new Date(tour.startDate).toLocaleDateString()} до {new Date(tour.endDate).toLocaleDateString()}</p>
                    <p>Макс. участников: {tour.maxParticipants}</p>
                    <p>Активен: {tour.isActive ? "Да" : "Нет"}</p>
                  </div>
                  {tour.images && tour.images.length > 0 && (
                    <div className="tour-images">
                      {tour.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000${img}`}
                          alt={`Тур ${tour.title}`}
                          className="tour-image"
                        />
                      ))}
                      {tour.images.length > 3 && (
                        <span className="more-images">+{tour.images.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="tour-actions">
                    <button className="btn btn-primary" onClick={() => handleEdit(tour)}>
                      Редактировать
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(tour.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

const statusTranslations = {
  pending: "В ожидании",
  confirmed: "Подтверждено",
  cancelled: "Отменено"
};

const getStatusText = (status) => statusTranslations[status] || status;

// Компонент для управления бронированиями
const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Требуется авторизация');
        return;
      }
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error);
      setError(error.response?.data?.message || 'Ошибка при загрузке бронирований');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setConfirmModal({
      show: true,
      message: `Вы уверены, что хотите ${newStatus === "confirmed" ? "подтвердить" : "отменить"} бронирование?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.put(`${API_URL}/bookings/${bookingId}/status`, 
            { status: newStatus }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchBookings();
        } catch (error) {
          console.error('Ошибка при обновлении статуса:', error);
        } finally {
          setConfirmModal({ show: false, message: '', onConfirm: null });
        }
      }
    });
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bookings-management">
      <ConfirmModal
        show={confirmModal.show}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false, message: '', onConfirm: null })}
      />
      <h2>Управление бронированиями</h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h3>Бронирование #{booking.id}</h3>
            <p>Тур: {booking.Tour?.title || 'Неизвестно'}</p>
            <p>Клиент: {booking.User?.name || 'Неизвестно'}</p>
            <p className={`status ${booking.status}`}>
              Статус: {getStatusText(booking.status)}
            </p>
            {booking.status === 'pending' && (
              <div className="booking-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                >
                  Подтвердить
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                >
                  Отменить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент для управления пользователями
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Требуется авторизация');
        return;
      }
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      setError(error.response?.data?.message || 'Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, currentStatus) => {
    setConfirmModal({
      show: true,
      message: currentStatus ? "Разблокировать пользователя?" : "Заблокировать пользователя?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`${API_URL}/users/${userId}/block`, 
            { isBlocked: !currentStatus }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchUsers();
        } catch (error) {
          console.error('Ошибка при блокировке:', error);
        } finally {
          setConfirmModal({ show: false, message: '', onConfirm: null });
        }
      }
    });
  };

  const handleChangeRole = async (userId, newRole) => {
    setConfirmModal({
      show: true,
      message: `Изменить роль пользователя на ${newRole}?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`${API_URL}/users/${userId}/role`, 
            { role: newRole }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchUsers();
        } catch (error) {
          console.error('Ошибка при изменении роли:', error);
        } finally {
          setConfirmModal({ show: false, message: '', onConfirm: null });
        }
      }
    });
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-management">
      <ConfirmModal
        show={confirmModal.show}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false, message: '', onConfirm: null })}
      />
      <h2>Управление пользователями</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p className="user-email">{user.email}</p>
            <p>Роль: {user.role}</p>
            <p>Статус: {user.isBlocked ? 'Заблокирован' : 'Активен'}</p>
            <div className="user-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
              >
                {user.role === 'admin' ? 'Сделать пользователем' : 'Сделать администратором'}
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleBlockUser(user.id, user.isBlocked)}
              >
                {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (newValue) => {
    setValue(newValue);
    const routes = ['/admin/tours', '/admin/bookings', '/admin/users'];
    navigate(routes[newValue] || routes[0]);
  };

  return (
    <div className="admin-dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Панель администратора</h1>

        <div className="tabs">
          {['Туры', 'Бронирования', 'Пользователи'].map((tab, index) => (
            <button
              key={index}
              className={`tab ${value === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tab-content">
          <Routes>
            <Route path="tours" element={<ToursManagement />} />
            <Route path="bookings" element={<BookingsManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="*" element={<ToursManagement />} />
          </Routes>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;