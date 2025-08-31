import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';
import ParisImg from "../images/Paris.jpg"
import RomeImg from "../images/Rome.jpg" 
import TokyoImg from "../images/Tokyo.jpeg"

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Широкий выбор туров', description: 'Более 100 направлений по всему миру', icon: '🌍' },
    { title: 'Лучшие цены', description: 'Гарантия лучшей цены на рынке', icon: '💰' },
    { title: 'Поддержка 24/7', description: 'Всегда на связи с вами', icon: '📞' }
  ];

  const popularDestinations = [
    { title: 'Париж', image: ParisImg, description: 'Романтическая столица Франции' },
    { title: 'Рим', image: RomeImg, description: 'Вечный город' },
    { title: 'Токио', image: TokyoImg, description: 'Современный мегаполис' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="overlay" />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1>Откройте для себя мир</h1>
            <p>Путешествуйте с нами и создавайте незабываемые воспоминания</p>
            <button className="main-button" onClick={() => navigate('/tours')}>Найти тур</button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          {features.map((feature, index) => (
            <motion.div key={index} className="feature-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="feature-icon">{feature.icon}</div>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Popular Destinations */}
      <div className="destinations-section">
        <h2 className="section-title">Популярные направления</h2>
        <div className="destinations-container">
          {popularDestinations.map((destination, index) => (
            <motion.div key={index} className="destination-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} onClick={() => navigate('/tours')}>
              <img src={destination.image} alt={destination.title} />
              <div className="destination-content">
                <h3>{destination.title}</h3>
                <p>{destination.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Готовы начать путешествие?</h2>
        <p>Присоединяйтесь к нам и откройте для себя новые горизонты</p>
        <button className="cta-button" onClick={() => navigate('/tours')}>Найти идеальный тур</button>
      </div>
      
    </div>

  );
};

export default Home;
