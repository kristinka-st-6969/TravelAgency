import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import './Tours.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tours';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchTours();
  }, [page, debouncedQuery, sortField, sortOrder]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: { 
          page, 
          limit: itemsPerPage, 
          search: debouncedQuery,
          sortField,
          sortOrder
        }
      });
      setTours(response.data.tours);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Ошибка при загрузке туров:', error);
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setShowSortMenu(false);
    setPage(1);
  };

  return (
    <div className="tours-page">
      {/* Заголовок страницы */}
      <div className="tours-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Все туры
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Найдите путешествие мечты среди лучших направлений
        </motion.p>
      </div>

      {/* Панель поиска и сортировки */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <label htmlFor="search" className="sr-only">Поиск туров</label>
          <input
            id="search"
            ref={inputRef}
            type="text"
            placeholder="Поиск туров..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="sort-container">
          <button 
            className="sort-button" 
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            Сортировка <ChevronDown size={18} />
          </button>
          {showSortMenu && (
            <div className="sort-menu">
              <button onClick={() => handleSortChange('price', 'ASC')}>По цене (возрастание)</button>
              <button onClick={() => handleSortChange('price', 'DESC')}>По цене (убывание)</button>
              <button onClick={() => handleSortChange('duration', 'ASC')}>По длительности (возрастание)</button>
              <button onClick={() => handleSortChange('duration', 'DESC')}>По длительности (убывание)</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Список туров */}
      <h2 className="section-title" id="tours-grid-heading">Список туров</h2>
      {loading ? (
        <div className="loader-container"><div className="spinner"></div></div>
      ) : (
        <>
          <div className="grid">
            {tours.length > 0 ? (
              tours.map((tour, index) => {
                const imgSrc = tour?.images?.[0] ? `http://localhost:5000${tour.images[0]}` : '/placeholder.jpg';
                const imgAlt = (tour.imageAlt && tour.imageAlt.trim()) ? tour.imageAlt.trim() : ""; // пустой alt = декоративное изображение

                return (
                  <motion.div
                    key={tour.id}
                    className="grid-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="card" onClick={() => navigate(`/tours/${tour.id}`)}>
                      <img
                        src={imgSrc}
                        alt={imgAlt}
                        className="card-image"
                      />
                      <div className="card-content">
                        <h3>{tour.title}</h3>
                        <p className="description">
                          {tour.description.length > 100 ? tour.description.substring(0, 100) + '…' : tour.description}
                        </p>
                        <p className="price">{tour.price} ₽</p>
                        <p className="duration">{tour.duration} дней</p>
                        <button className="details-button" aria-label={`Подробнее о туре: ${tour.title}`}>Подробнее</button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="no-tours">Туры не найдены</p>
            )}
          </div>

          {/* Пагинация */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`page-button ${page === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tours;
