import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './TourDetails.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [bookingData, setBookingData] = useState({
    numberOfPeople: 1,
    specialRequests: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false); // управление модальным окном
  const [booked, setBooked] = useState(false); // состояние бронирования
  const [bookingMessage, setBookingMessage] = useState(''); // сообщение для пользователя

  // Получаем детали тура
  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tours/${id}`);
      setTour(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке деталей тура:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => setSelectedImage(image);
  const handleCloseImage = () => setSelectedImage(null);

  // Обновление данных бронирования из формы
  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  // Обработчик кнопки "Забронировать" — открываем модалку
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowConfirm(true);
  };

  // Подтверждение бронирования
  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/bookings`,
        { tourId: id, ...bookingData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setError(null);
      setBooked(true); // тур отмечаем как забронированный
      setBookingMessage('Бронирование успешно создано!'); // новое сообщение

      // Сбрасываем данные бронирования
      setBookingData({ numberOfPeople: 1, specialRequests: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при бронировании');
      setSuccess(false);
    } finally {
      setShowConfirm(false);
    }
  };

  // Отмена бронирования
  const cancelBooking = () => {
    setBooked(false);
    setSuccess(true);
    setError(null);
    setBookingMessage('Бронирование отменено'); // новое сообщение
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container">
        <h2 className="error-text">Тур не найден</h2>
      </div>
    );
  }

  return (
    <div className="container-tour-details">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="grid-details">
          <div className="main-content">
            <h1>{tour.title}</h1>
            <p>{tour.description}</p>

            {tour.images?.map((image, index) => (
              <div key={index} className="image-item" onClick={() => handleImageClick(image)}>
                <img
                  src={`http://localhost:5000${image}`}
                  alt={`${tour.title} - фото ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}

            {selectedImage && (
              <div className="dialog" onClick={handleCloseImage}>
                <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                  <img src={selectedImage} alt="Увеличенное фото" />
                </div>
              </div>
            )}

            <h3>Детали тура:</h3>
            <div className="details-grid">
              <p><strong>Длительность:</strong> {tour.duration} дней</p>
              <p><strong>Направление:</strong> {tour.destination}</p>
              <p><strong>Дата начала:</strong> {new Date(tour.startDate).toLocaleDateString()}</p>
              <p><strong>Дата окончания:</strong> {new Date(tour.endDate).toLocaleDateString()}</p>
              <p><strong>Макс. участников:</strong> {tour.maxParticipants}</p>
            </div>
          </div>

          <div className="side-content">
            <div className="booking-card">
              <h2>{tour.price} ₽</h2>
              <p className="price-note">за человека</p>

              <form onSubmit={handleBookingSubmit}>
                <label>
                  Количество человек:
                  <input
                    type="number"
                    name="numberOfPeople"
                    min="1"
                    max={tour.maxParticipants}
                    value={bookingData.numberOfPeople}
                    onChange={handleBookingChange}
                    required
                    disabled={booked} // если уже забронировано — нельзя менять
                  />
                </label>

                {error && <div className="alert error">{error}</div>}
                {success && (
                  <div
                    className={`alert ${
                      booked ? 'success' : 'error'
                    }`}
                  >
                    {bookingMessage}
                  </div>
                )}

                {/* Кнопки меняются в зависимости от состояния бронирования */}
                {!booked ? (
                  <button type="submit" className="book-button">Забронировать</button>
                ) : (
                  <>
                    <button type="button" className="cancel-booking-button" onClick={cancelBooking}>
                      Отменить бронирование
                    </button>
                    <button type="button" className="other-tours-button" onClick={() => navigate('/tours')}>
                      К другим турам
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Модальное окно подтверждения */}
      <AnimatePresence>
        {showConfirm && (
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
              <h1 className="text-xl font-bold mb-4">Подтверждение бронирования</h1>
              <h3 className="text-xl font-bold mb-5">Вы уверены, что хотите забронировать тур?</h3>

              <ul className="modal-details">
                <li><strong>Название:</strong> {tour.title}</li>
                <li><strong>Направление:</strong> {tour.destination}</li>
                <li><strong>Стоимость:</strong> {tour.price} ₽</li>
                <li><strong>Количество человек:</strong> {bookingData.numberOfPeople}</li>
              </ul>

              <div className="modal-actions">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="cancel-btn"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmBooking}
                  className="confirm-btn"
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

export default TourDetails;
