// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Grid,
//   Typography,
//   Button,
//   Box,
//   Paper,
//   ImageList,
//   ImageListItem,
//   Dialog,
//   DialogContent,
//   CircularProgress,
//   TextField,
//   Alert
// } from '@mui/material';
// import { motion } from 'framer-motion';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const TourDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const [tour, setTour] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [bookingData, setBookingData] = useState({
//     numberOfPeople: 1,
//     specialRequests: ''
//   });
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     fetchTourDetails();
//   }, [id]);

//   const fetchTourDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/tours/${id}`);
//       setTour(response.data);
//     } catch (error) {
//       console.error('Ошибка при загрузке деталей тура:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//   };

//   const handleCloseImage = () => {
//     setSelectedImage(null);
//   };

//   const handleBookingChange = (e) => {
//     setBookingData({
//       ...bookingData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `${API_URL}/bookings`,
//         {
//           tourId: id,
//           ...bookingData
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setSuccess(true);
//       setError(null);
//       setBookingData({
//         numberOfPeople: 1,
//         specialRequests: ''
//       });
//     } catch (error) {
//       setError(error.response?.data?.message || 'Ошибка при бронировании');
//       setSuccess(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="60vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!tour) {
//     return (
//       <Container>
//         <Typography variant="h5" color="error">
//           Тур не найден
//         </Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={8}>
//             <Typography variant="h4" gutterBottom>
//               {tour.title}
//             </Typography>
//             <Typography variant="body1" paragraph>
//               {tour.description}
//             </Typography>

//             <ImageList cols={3} rowHeight={200} sx={{ mb: 4 }}>
//               {tour.images?.map((image, index) => (
//                 <ImageListItem
//                   key={index}
//                   sx={{ cursor: 'pointer' }}
//                   onClick={() => handleImageClick(image)}
//                 >
//                   <img
//                     src={`http://localhost:5000${image}`}
//                     alt={`${tour.title} - фото ${index + 1}`}
//                     loading="lazy"
//                   />
//                 </ImageListItem>
//               ))}
//             </ImageList>

//             <Dialog
//               open={!!selectedImage}
//               onClose={handleCloseImage}
//               maxWidth="lg"
//             >
//               <DialogContent>
//                 <img
//                   src={selectedImage}
//                   alt="Увеличенное фото"
//                   style={{ width: '100%', height: 'auto' }}
//                 />
//               </DialogContent>
//             </Dialog>

//             <Typography variant="h6" gutterBottom>
//               Детали тура:
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Typography variant="body1">
//                   <strong>Длительность:</strong> {tour.duration} дней
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="body1">
//                   <strong>Направление:</strong> {tour.destination}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="body1">
//                   <strong>Дата начала:</strong>{' '}
//                   {new Date(tour.startDate).toLocaleDateString()}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="body1">
//                   <strong>Дата окончания:</strong>{' '}
//                   {new Date(tour.endDate).toLocaleDateString()}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="body1">
//                   <strong>Макс. участников:</strong> {tour.maxParticipants}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Paper
//               elevation={3}
//               sx={{
//                 p: 3,
//                 position: 'sticky',
//                 top: 100
//               }}
//             >
//               <Typography variant="h5" gutterBottom>
//                 {tour.price} ₽
//               </Typography>
//               <Typography variant="body2" color="text.secondary" paragraph>
//                 за человека
//               </Typography>

//               <Box component="form" onSubmit={handleBookingSubmit}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   name="numberOfPeople"
//                   label="Количество человек"
//                   value={bookingData.numberOfPeople}
//                   onChange={handleBookingChange}
//                   inputProps={{ min: 1, max: tour.maxParticipants }}
//                   sx={{ mb: 2 }}
//                 />
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   name="specialRequests"
//                   label="Особые пожелания"
//                   value={bookingData.specialRequests}
//                   onChange={handleBookingChange}
//                   sx={{ mb: 2 }}
//                 />
//                 {error && (
//                   <Alert severity="error" sx={{ mb: 2 }}>
//                     {error}
//                   </Alert>
//                 )}
//                 {success && (
//                   <Alert severity="success" sx={{ mb: 2 }}>
//                     Бронирование успешно создано!
//                   </Alert>
//                 )}
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   size="large"
//                 >
//                   Забронировать
//                 </Button>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </motion.div>
//     </Container>
//   );
// };

// export default TourDetails; 



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/bookings`,
        {
          tourId: id,
          ...bookingData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess(true);
      setError(null);
      setBookingData({
        numberOfPeople: 1,
        specialRequests: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при бронировании');
      setSuccess(false);
    }
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid-details">
          <div className="main-content">
            <h1>{tour.title}</h1>
            <p>{tour.description}</p>

              {tour.images?.map((image, index) => (
                <div
                  key={index}
                  className="image-item"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`${tour.title} - фото ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            {/* <div className="image-list">
              {tour.images?.map((image, index) => (
                <div
                  key={index}
                  className="image-item"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`${tour.title} - фото ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div> */}

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
                  />
                </label>


                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">Бронирование успешно создано!</div>}

                <button type="submit" className="book-button">Забронировать</button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TourDetails;
