// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Avatar,
//   Button,
//   TextField,
//   Tabs,
//   Tab,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import { motion } from 'framer-motion';
// import { useSelector, useDispatch } from 'react-redux';
// import UserIcon from "../images/user-icon_blue.svg"
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const Profile = () => {
//   const [value, setValue] = useState(0);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         ...formData,
//         name: user.name,
//         email: user.email
//       });
//     }
//     fetchBookings();
//   }, [user]);

//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/bookings/my`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setBookings(response.data);
//     } catch (error) {
//       console.error('Ошибка при загрузке бронирований:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API_URL}/users/profile`,
//         {
//           name: formData.name,
//           email: formData.email
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setSuccess('Профиль успешно обновлен');
//       setError(null);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Ошибка при обновлении профиля');
//       setSuccess(false);
//     }
//   };

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();
//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('Пароли не совпадают');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API_URL}/users/password`,
//         {
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setSuccess('Пароль успешно обновлен');
//       setError(null);
//       setFormData({
//         ...formData,
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     } catch (error) {
//       setError(error.response?.data?.message || 'Ошибка при обновлении пароля');
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


//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={4}>
//             <Paper sx={{ p: 3, textAlign: 'center' }}>
//               <Avatar
//                 src={user?.avatar}
//                 alt={user?.name}
//                 sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
//               />
//               <Typography variant="h5" gutterBottom>
//                 {user?.name}
//               </Typography>
//               <Typography variant="body1" color="text.secondary">
//                 {user?.email}
//               </Typography>
//               <Button
//                 variant="outlined"
//                 component="label"
//                 sx={{ mt: 2 }}
//               >
//                 Загрузить фото
//                 <input type="file" hidden accept="image/*" />
//               </Button>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={8}>
//             <Paper sx={{ p: 3 }}>
//               <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//                 <Tabs value={value} onChange={handleTabChange}>
//                   <Tab label="Профиль" />
//                   <Tab label="Бронирования" />
//                   <Tab label="Безопасность" />
//                 </Tabs>
//               </Box>

//               {error && (
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {error}
//                 </Alert>
//               )}
//               {success && (
//                 <Alert severity="success" sx={{ mb: 2 }}>
//                   {success}
//                 </Alert>
//               )}

//               {value === 0 && (
//                 <Box component="form" onSubmit={handleProfileUpdate}>
//                   <TextField
//                     fullWidth
//                     label="Имя"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     margin="normal"
//                   />
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     margin="normal"
//                   />
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     sx={{ mt: 2 }}
//                   >
//                     Сохранить изменения
//                   </Button>
//                 </Box>
//               )}

//               {value === 1 && (
//                 <Box>
//                   {bookings.length === 0 ? (
//                     <Typography>У вас пока нет бронирований</Typography>
//                   ) : (
//                     bookings.map((booking) => (
//                       <Paper key={booking.id} sx={{ p: 2, mb: 2 }}>
//                         <Typography variant="h6">
//                           {booking.Tour.title}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Статус: {booking.status}
//                         </Typography>
//                         <Typography variant="body2">
//                           Дата: {new Date(booking.createdAt).toLocaleDateString()}
//                         </Typography>
//                         <Typography variant="body2">
//                           Количество человек: {booking.numberOfPeople}
//                         </Typography>
//                         <Typography variant="body2">
//                           Общая стоимость: {booking.totalPrice} ₽
//                         </Typography>
//                       </Paper>
//                     ))
//                   )}
//                 </Box>
//               )}

//               {value === 2 && (
//                 <Box component="form" onSubmit={handlePasswordUpdate}>
//                   <TextField
//                     fullWidth
//                     label="Текущий пароль"
//                     name="currentPassword"
//                     type="password"
//                     value={formData.currentPassword}
//                     onChange={handleChange}
//                     margin="normal"
//                   />
//                   <TextField
//                     fullWidth
//                     label="Новый пароль"
//                     name="newPassword"
//                     type="password"
//                     value={formData.newPassword}
//                     onChange={handleChange}
//                     margin="normal"
//                   />
//                   <TextField
//                     fullWidth
//                     label="Подтвердите новый пароль"
//                     name="confirmPassword"
//                     type="password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     margin="normal"
//                   />
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     sx={{ mt: 2 }}
//                   >
//                     Изменить пароль
//                   </Button>
//                 </Box>
//               )}
//             </Paper>
//           </Grid>
//         </Grid>
//       </motion.div>
//     </Container>
//   );
// };

// export default Profile; 





import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
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
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Пароли не совпадают');
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
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container-profile">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid-profile">
          <div className="profile-card">
            <img
              src={user?.avatar || UserIcon}
              alt={user?.name}
              className="avatar-profile"
            />
            <h2>{user?.name}</h2>
            <p className="email">{user?.email}</p>
          </div>

          <div className="profile-content">
            <div className="tabs">
              <button
                className={value === 0 ? 'active' : ''}
                onClick={() => handleTabChange(0)}
              >
                Профиль
              </button>
              <button
                className={value === 1 ? 'active' : ''}
                onClick={() => handleTabChange(1)}
              >
                Бронирования
              </button>
              <button
                className={value === 2 ? 'active' : ''}
                onClick={() => handleTabChange(2)}
              >
                Безопасность
              </button>
            </div>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            {value === 0 && (
              <form onSubmit={handleProfileUpdate}>
                <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="primary-btn">Сохранить изменения</button>
              </form>
            )}

            {value === 1 && (
              <div>
                {bookings.length === 0 ? (
                  <p>У вас пока нет бронирований</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <h3>{booking.Tour.title}</h3>
                      <p>Статус: {booking.status}</p>
                      <p>Дата: {new Date(booking.createdAt).toLocaleDateString()}</p>
                      <p>Количество человек: {booking.numberOfPeople}</p>
                      <p>Общая стоимость: {booking.totalPrice} ₽</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {value === 2 && (
              <form onSubmit={handlePasswordUpdate}>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Текущий пароль"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Новый пароль"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Подтвердите новый пароль"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="primary-btn">Изменить пароль</button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
