// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container, Grid, Card, CardContent, CardMedia, Typography,
//   Button, Pagination, Box, TextField, InputAdornment, CircularProgress
// } from '@mui/material';
// import { Search as SearchIcon } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tours';

// const Tours = () => {
//   const [tours, setTours] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedQuery, setDebouncedQuery] = useState('');
//   const itemsPerPage = 6;
//   const navigate = useNavigate();

//   // debounce для поиска
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedQuery(searchQuery);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   useEffect(() => {
//     fetchTours();
//   }, [page, debouncedQuery]);

//   const fetchTours = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(API_URL, {
//         params: {
//           page,
//           limit: itemsPerPage,
//           search: debouncedQuery
//         }
//       });

//       setTours(response.data.tours);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error('Ошибка при загрузке туров:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     setPage(1);
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Box sx={{ mb: 4 }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Поиск туров..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Typography variant="h4" color="primary" sx={{ mt: 2 }}>Список туров</Typography>
//       </Box>

//       <Grid container spacing={4}>
//         {tours.length > 0 ? (
//           tours.map((tour) => (
//             <Grid item key={tour.id} xs={12} sm={6} md={4}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Card
//                   sx={{
//                     height: 500,
//                     width: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     cursor: 'pointer',
//                     '&:hover': {
//                       transform: 'scale(1.02)',
//                       transition: 'transform 0.2s ease-in-out'
//                     }
//                   }}
//                   onClick={() => navigate(`/tours/${tour.id}`)}
//                 >
//                   <CardMedia
//                     component="img"
//                     sx={{ width: 300, height: 290, objectFit: 'cover' }}
//                     image={`http://localhost:5000${tour.images?.[0]}` || '/placeholder.jpg'}
//                     alt={tour.title}
//                   />
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography gutterBottom variant="h5" component="h2">
//                       {tour.title}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" paragraph>
//                       {tour.description.length > 100
//                         ? tour.description.substring(0, 100) + '...'
//                         : tour.description}
//                     </Typography>
//                     <Typography variant="h6" color="primary">
//                       {tour.price} ₽
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {tour.duration} дней
//                     </Typography>
//                     <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
//                       Подробнее
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))
//         ) : (
//           <Typography variant="h6" align="center" sx={{ width: '100%', mt: 4 }}>
//             Туры не найдены
//           </Typography>
//         )}
//       </Grid>

//       <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//         <Pagination
//           count={totalPages}
//           page={page}
//           onChange={handlePageChange}
//           color="primary"
//           size="large"
//         />
//       </Box>
//     </Container>
//   );
// };

// export default Tours;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Tours.css'; // подключаем CSS-файл

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tours';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchTours();
  }, [page, debouncedQuery]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: { page, limit: itemsPerPage, search: debouncedQuery }
      });
      setTours(response.data.tours);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Ошибка при загрузке туров:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="search-container">
        <div className="search-input-wrapper">
          {/* <span className="search-icon">🔍</span> */}
          <input
            type="text"
            placeholder="Поиск туров..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <h2 className="title-tours">Список туров</h2>
      </div>

      <div className="grid">
        {tours.length > 0 ? (
          tours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid-item"
            >
              <div className="card" onClick={() => navigate(`/tours/${tour.id}`)}>
                <img
                  src={`http://localhost:5000${tour.images?.[0]}` || '/placeholder.jpg'}
                  alt={tour.title}
                  className="card-image"
                />
                <div className="card-content">
                  <h3>{tour.title}</h3>
                  <p className="description">
                    {tour.description.length > 100
                      ? tour.description.substring(0, 100) + '...'
                      : tour.description}
                  </p>
                  <p className="price">{tour.price} ₽</p>
                  <p className="duration">{tour.duration} дней</p>
                  <button className="details-button">Подробнее</button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="no-tours">Туры не найдены</p>
        )}
      </div>

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
    </div>
  );
};

export default Tours;
