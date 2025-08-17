// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Tabs,
//   Tab,
//   Button,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Checkbox,
//   FormControlLabel
// } from '@mui/material';
// import { motion } from 'framer-motion';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Компонент для управления турами
// const ToursManagement = () => {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(3);
//   const [totalPages, setTotalPages] = useState(1);
  
//   const [tours, setTours] = useState([]);
//   const [form, setForm] = useState({
//     id: null,
//     title: '',
//     description: '',
//     price: '',
//     duration: '',
//     destination: '',
//     startDate: '',
//     endDate: '',
//     maxParticipants: '',
//     isActive: true,
//   });
//   const [images, setImages] = useState([]);
//   const [editing, setEditing] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);

//   // Получение всех туров
//   const fetchTours = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/tours?page=${page}&limit=${limit}`);
//       setTours(res.data.tours);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchTours();
//   }, [page]);

//   // Обработка изменения полей
//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   // Обработка выбора картинок
//   const handleImagesChange = e => {
//     setImages(e.target.files);
//   };

//   // Отправка формы (создание или обновление)
//   const handleSubmit = async e => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.entries(form).forEach(([key, val]) => formData.append(key, val));
//     for (let i = 0; i < images.length; i++) {
//       formData.append('images', images[i]);
//     }

//     try {
//       if (editing) {
//         await axios.put(`${API_URL}/tours/${form.id}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         await axios.post(`${API_URL}/tours`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }
//       setForm({
//         id: null,
//         title: '',
//         description: '',
//         price: '',
//         duration: '',
//         destination: '',
//         startDate: '',
//         endDate: '',
//         maxParticipants: '',
//         isActive: true,
//       });
//       setImages([]);
//       setEditing(false);
//       fetchTours();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Открыть модалку для создания тура
//   const handleOpenCreate = () => {
//     setForm({
//       id: null,
//       title: '',
//       description: '',
//       price: '',
//       duration: '',
//       destination: '',
//       startDate: '',
//       endDate: '',
//       maxParticipants: '',
//       isActive: true,
//     });
//     setEditing(false);
//     setImages([]);
//     setModalOpen(true);
//   };

//   // Открыть модалку для редактирования тура
//   const handleEdit = tour => {
//     setForm({
//       id: tour.id,
//       title: tour.title,
//       description: tour.description,
//       price: tour.price,
//       duration: tour.duration,
//       destination: tour.destination,
//       startDate: tour.startDate.split('T')[0],
//       endDate: tour.endDate.split('T')[0],
//       maxParticipants: tour.maxParticipants,
//       isActive: tour.isActive,
//     });
//     setEditing(true);
//     setImages([]);
//     setModalOpen(true);
//   };

//   // Закрыть модалку
//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setEditing(false);
//     setForm({
//       id: null,
//       title: '',
//       description: '',
//       price: '',
//       duration: '',
//       destination: '',
//       startDate: '',
//       endDate: '',
//       maxParticipants: '',
//       isActive: true,
//     });
//     setImages([]);
//   };

//   // Удаление тура
//   const handleDelete = async id => {
//     if (!window.confirm('Удалить этот тур?')) return;
//     try {
//       await axios.delete(`${API_URL}/tours/${id}`);
//       fetchTours();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Box sx={{ p: 2, maxWidth: 900, margin: 'auto' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h5">Управление турами</Typography>
//         <Button variant="contained" color="primary" onClick={handleOpenCreate}>
//           Добавить тур
//         </Button>
//       </Box>
//       <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
//         <DialogTitle>{editing ? 'Редактировать тур' : 'Добавить тур'}</DialogTitle>
//         <DialogContent>
//           <Box component="form" id="tour-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//             <TextField
//               name="title"
//               label="Название"
//               value={form.title}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="description"
//               label="Описание"
//               value={form.description}
//               onChange={handleChange}
//               fullWidth
//               required
//               multiline
//               rows={3}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="price"
//               label="Цена"
//               type="number"
//               value={form.price}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="duration"
//               label="Длительность (дней)"
//               type="number"
//               value={form.duration}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="destination"
//               label="Направление"
//               value={form.destination}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="startDate"
//               label="Дата начала"
//               type="date"
//               value={form.startDate}
//               onChange={handleChange}
//               fullWidth
//               required
//               InputLabelProps={{ shrink: true }}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="endDate"
//               label="Дата окончания"
//               type="date"
//               value={form.endDate}
//               onChange={handleChange}
//               fullWidth
//               required
//               InputLabelProps={{ shrink: true }}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="maxParticipants"
//               label="Макс. участников"
//               type="number"
//               value={form.maxParticipants}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={form.isActive}
//                   onChange={handleChange}
//                   name="isActive"
//                   color="primary"
//                 />
//               }
//               label="Активен"
//               sx={{ mb: 2 }}
//             />
//             <Button
//               variant="contained"
//               component="label"
//               sx={{ mb: 2 }}
//             >
//               Загрузить картинки
//               <input
//                 type="file"
//                 hidden
//                 multiple
//                 accept="image/*"
//                 onChange={handleImagesChange}
//               />
//             </Button>
//             {images.length > 0 && (
//               <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
//                 {[...images].map((img, i) => (
//                   <Typography key={i} variant="caption">{img.name}</Typography>
//                 ))}
//               </Box>
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal}>Отмена</Button>
//           <Button type="submit" form="tour-form" variant="contained" color="primary">
//             {editing ? 'Сохранить' : 'Добавить'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Box sx={{ mt: 3 }}>
//         {tours.length === 0 && <Typography>Туров пока нет.</Typography>}
//         <Grid container spacing={2}>
//           {tours.map(tour => (
//             <Grid item xs={12} md={6} key={tour.id}>
//               <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 3 }}>
//                 <Typography variant="h6">{tour.title}</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{tour.description}</Typography>
//                 <Typography variant="body2">Цена: {tour.price} ₽</Typography>
//                 <Typography variant="body2">Длительность: {tour.duration} дней</Typography>
//                 <Typography variant="body2">Направление: {tour.destination}</Typography>
//                 <Typography variant="body2">С {new Date(tour.startDate).toLocaleDateString()} до {new Date(tour.endDate).toLocaleDateString()}</Typography>
//                 <Typography variant="body2">Макс. участников: {tour.maxParticipants}</Typography>
//                 <Typography variant="body2">Активен: {tour.isActive ? 'Да' : 'Нет'}</Typography>
//                 <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1, flexWrap: 'wrap' }}>
//                   {tour.images && tour.images.map((img, i) => (
//                     <img
//                       key={i}
//                       src={`http://localhost:5000${img}`}
//                       alt="Tour"
//                       style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }}
//                     />
//                   ))}
//                 </Box>
//                 <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
//                   <Button size="small" variant="outlined" onClick={() => handleEdit(tour)}>
//                     Редактировать
//                   </Button>
//                   <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(tour.id)}>
//                     Удалить
//                   </Button>
//                 </Box>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
//           <Button
//             onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//           >
//             Назад
//           </Button>
//           <Typography sx={{ mx: 2 }}>Страница {page} из {totalPages}</Typography>
//           <Button
//             onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={page === totalPages}
//           >
//             Далее
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// // Компонент для управления бронированиями
// const BookingsManagement = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Требуется авторизация');
//         return;
//       }
//       const response = await axios.get(`${API_URL}/bookings`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setBookings(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Ошибка при загрузке бронирований:', error);
//       setError(error.response?.data?.message || 'Ошибка при загрузке бронирований');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (bookingId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API_URL}/bookings/${bookingId}/status`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       fetchBookings();
//     } catch (error) {
//       console.error('Ошибка при обновлении статуса:', error);
//       setError(error.response?.data?.message || 'Ошибка при обновлении статуса');
//     }
//   };

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

//   return (
//     <Box>
//       <Typography variant="h5" sx={{ mb: 3 }}>
//         Управление бронированиями
//       </Typography>
//       <Grid container spacing={3}>
//         {bookings.map((booking) => (
//           <Grid item xs={12} md={6} key={booking.id}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6">
//                 Бронирование #{booking.id}
//               </Typography>
//               <Typography variant="body2">
//                 Тур: {booking.Tour.title}
//               </Typography>
//               <Typography variant="body2">
//                 Клиент: {booking.User.name}
//               </Typography>
//               <Typography variant="body2">
//                 Статус: {booking.status}
//               </Typography>
//               <Box sx={{ mt: 2 }}>
//                 {booking.status === 'pending' && (
//                   <>
//                     <Button 
//                       size="small" 
//                       sx={{ mr: 1 }}
//                       onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
//                     >
//                       Подтвердить
//                     </Button>
//                     <Button 
//                       size="small" 
//                       color="error"
//                       onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
//                     >
//                       Отменить
//                     </Button>
//                   </>
//                 )}
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// // Компонент для управления пользователями
// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Требуется авторизация');
//         return;
//       }
//       const response = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Ошибка при загрузке пользователей:', error);
//       setError(error.response?.data?.message || 'Ошибка при загрузке пользователей');
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleBlockUser = async (userId, currentStatus) => {
//   console.log(`Блокировка пользователя с id: ${userId}, текущий статус: ${currentStatus}`);
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(`${API_URL}/users/${userId}/block`, 
//       { isBlocked: !currentStatus }, 
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     console.log('Ответ от сервера:', response.data);
//     fetchUsers();
//   } catch (error) {
//     console.error('Ошибка при блокировке пользователя:', error);
//     setError(error.response?.data?.message || 'Ошибка при блокировке пользователя');
//   }
// };


//   const handleChangeRole = async (userId, newRole) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`${API_URL}/users/${userId}/role`, 
//         { role: newRole },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchUsers();
//     } catch (error) {
//       console.error('Ошибка при изменении роли:', error);
//       setError(error.response?.data?.message || 'Ошибка при изменении роли');
//     }
//   };

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

//   return (
//     <Box>
//       <Typography variant="h5" sx={{ mb: 3 }}>
//         Управление пользователями
//       </Typography>
//       <Grid container spacing={3}>
//         {users.map((user) => (
//           <Grid item xs={12} md={6} key={user.id}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6">{user.name}</Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {user.email}
//               </Typography>
//               <Typography variant="body2">
//                 Роль: {user.role}
//               </Typography>
//               <Box sx={{ mt: 2 }}>
//                 <Button 
//                   size="small" 
//                   sx={{ mr: 1 }}
//                   onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
//                 >
//                   {user.role === 'admin' ? 'Сделать пользователем' : 'Сделать администратором'}
//                 </Button>
//                 <Button 
//                   size="small" 
//                   color="error"
//                   onClick={() => handleBlockUser(user.id, user.isBlocked)}
//                 >
//                   {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
//                 </Button>
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// const AdminDashboard = () => {
//   const [value, setValue] = useState(0);
//   const navigate = useNavigate();

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//     switch (newValue) {
//       case 0:
//         navigate('/admin/tours');
//         break;
//       case 1:
//         navigate('/admin/bookings');
//         break;
//       case 2:
//         navigate('/admin/users');
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Typography variant="h4" gutterBottom>
//           Панель администратора
//         </Typography>

//         <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//           <Tabs value={value} onChange={handleChange}>
//             <Tab label="Туры" />
//             <Tab label="Бронирования" />
//             <Tab label="Пользователи" />
//           </Tabs>
//         </Box>

//         <Routes>
//           <Route path="tours" element={<ToursManagement />} />
//           <Route path="bookings" element={<BookingsManagement />} />
//           <Route path="users" element={<UsersManagement />} />
//           <Route path="*" element={<ToursManagement />} />
//         </Routes>
//       </motion.div>
//     </Container>
//   );
// };

// export default AdminDashboard; 




// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {useNavigate, Route, Routes} from 'react-router-dom'
// import axios from 'axios';
// import './AdminDashboard.css';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const ToursManagement = () => {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(3);
//   const [totalPages, setTotalPages] = useState(1);
//   const [tours, setTours] = useState([]);
//   const [form, setForm] = useState({
//     id: null,
//     title: '',
//     description: '',
//     price: '',
//     duration: '',
//     destination: '',
//     startDate: '',
//     endDate: '',
//     maxParticipants: '',
//     isActive: true,
//   });
//   const [images, setImages] = useState([]);
//   const [editing, setEditing] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);

//   const fetchTours = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/tours?page=${page}&limit=${limit}`);
//       setTours(res.data.tours);
//       setTotalPages(res.data.totalPages);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchTours();
//   }, [page]);

//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleImagesChange = e => {
//     setImages(e.target.files);
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, val]) => formData.append(key, val));
//     for (let i = 0; i < images.length; i++) {
//       formData.append('images', images[i]);
//     }

//     try {
//       if (editing) {
//         await axios.put(`${API_URL}/tours/${form.id}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         await axios.post(`${API_URL}/tours`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }
//       resetForm();
//       fetchTours();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       id: null,
//       title: '',
//       description: '',
//       price: '',
//       duration: '',
//       destination: '',
//       startDate: '',
//       endDate: '',
//       maxParticipants: '',
//       isActive: true,
//     });
//     setImages([]);
//     setEditing(false);
//     setModalOpen(false);
//   };

//   const handleOpenCreate = () => {
//     resetForm();
//     setModalOpen(true);
//   };

//   const handleEdit = tour => {
//     setForm({
//       id: tour.id,
//       title: tour.title,
//       description: tour.description,
//       price: tour.price,
//       duration: tour.duration,
//       destination: tour.destination,
//       startDate: tour.startDate.split('T')[0],
//       endDate: tour.endDate.split('T')[0],
//       maxParticipants: tour.maxParticipants,
//       isActive: tour.isActive,
//     });
//     setEditing(true);
//     setImages([]);
//     setModalOpen(true);
//   };

//   const handleDelete = async id => {
//     if (window.confirm('Удалить этот тур?')) {
//       try {
//         await axios.delete(`${API_URL}/tours/${id}`);
//         fetchTours();
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         <h2>Управление турами</h2>
//         <button className="btn" onClick={handleOpenCreate}>Добавить тур</button>
//       </div>

//       {modalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>{editing ? 'Редактировать тур' : 'Добавить тур'}</h3>
//             <form onSubmit={handleSubmit}>
//               <input type="text" name="title" placeholder="Название" value={form.title} onChange={handleChange} required />
//               <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} required rows="3"></textarea>
//               <input type="number" name="price" placeholder="Цена" value={form.price} onChange={handleChange} required />
//               <input type="number" name="duration" placeholder="Длительность (дней)" value={form.duration} onChange={handleChange} required />
//               <input type="text" name="destination" placeholder="Направление" value={form.destination} onChange={handleChange} required />
//               <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
//               <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
//               <input type="number" name="maxParticipants" placeholder="Макс. участников" value={form.maxParticipants} onChange={handleChange} required />

//               <label>
//                 <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
//                 Активен
//               </label>

//               <label className="upload-btn">
//                 Загрузить картинки
//                 <input type="file" multiple accept="image/*" onChange={handleImagesChange} hidden />
//               </label>

//               {images.length > 0 && (
//                 <div className="image-list">
//                   {[...images].map((img, i) => (
//                     <span key={i} className="image-name">{img.name}</span>
//                   ))}
//                 </div>
//               )}

//               <div className="modal-actions">
//                 <button type="button" className="btn" onClick={() => setModalOpen(false)}>Отмена</button>
//                 <button type="submit" className="btn btn-primary">{editing ? 'Сохранить' : 'Добавить'}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="tour-list">
//         {tours.length === 0 ? (
//           <p>Туров пока нет.</p>
//         ) : (
//           tours.map(tour => (
//             <motion.div key={tour.id} className="tour-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//               <h4>{tour.title}</h4>
//               <p>{tour.description}</p>
//               <p>Цена: {tour.price} ₽</p>
//               <p>Длительность: {tour.duration} дней</p>
//               <p>Направление: {tour.destination}</p>
//               <p>С {new Date(tour.startDate).toLocaleDateString()} до {new Date(tour.endDate).toLocaleDateString()}</p>
//               <p>Макс. участников: {tour.maxParticipants}</p>
//               <p>Активен: {tour.isActive ? 'Да' : 'Нет'}</p>
//               <div className="tour-images">
//                 {tour.images && tour.images.map((img, i) => (
//                   <img key={i} src={`http://localhost:5000${img}`} alt="Tour" />
//                 ))}
//               </div>
//               <div className="card-actions">
//                 <button className="btn" onClick={() => handleEdit(tour)}>Редактировать</button>
//                 <button className="btn btn-danger" onClick={() => handleDelete(tour.id)}>Удалить</button>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// const BookingsManagement = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Требуется авторизация');
//         return;
//       }
//       const response = await axios.get(`${API_URL}/bookings`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setBookings(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Ошибка при загрузке бронирований:', error);
//       setError(error.response?.data?.message || 'Ошибка при загрузке бронирований');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (bookingId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API_URL}/bookings/${bookingId}/status`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       fetchBookings();
//     } catch (error) {
//       console.error('Ошибка при обновлении статуса:', error);
//       setError(error.response?.data?.message || 'Ошибка при обновлении статуса');
//     }
//   };

//   if (loading) {
//     return <div className="spinner"></div>;
//   }

//   if (error) {
//     return <div className="alert">{error}</div>;
//   }

//   return (
//     <div className="bookings-container">
//       <h2 className="title">Управление бронированиями</h2>
//       <div className="bookings-grid">
//         {bookings.map((booking) => (
//           <div className="booking-card" key={booking.id}>
//             <h3>Бронирование #{booking.id}</h3>
//             <p><strong>Тур:</strong> {booking.Tour.title}</p>
//             <p><strong>Клиент:</strong> {booking.User.name}</p>
//             <p><strong>Статус:</strong> {booking.status}</p>
//             {booking.status === 'pending' && (
//               <div className="buttons">
//                 <button onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>
//                   Подтвердить
//                 </button>
//                 <button className="cancel" onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>
//                   Отменить
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Требуется авторизация');
//         return;
//       }
//       const response = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Ошибка при загрузке пользователей:', error);
//       setError(error.response?.data?.message || 'Ошибка при загрузке пользователей');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlockUser = async (userId, currentStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`${API_URL}/users/${userId}/block`,
//         { isBlocked: !currentStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchUsers();
//     } catch (error) {
//       console.error('Ошибка при блокировке пользователя:', error);
//       setError(error.response?.data?.message || 'Ошибка при блокировке пользователя');
//     }
//   };

//   const handleChangeRole = async (userId, newRole) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`${API_URL}/users/${userId}/role`,
//         { role: newRole },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchUsers();
//     } catch (error) {
//       console.error('Ошибка при изменении роли:', error);
//       setError(error.response?.data?.message || 'Ошибка при изменении роли');
//     }
//   };

//   if (loading) {
//     return <div className="loader"></div>;
//   }

//   if (error) {
//     return <div className="alert error">{error}</div>;
//   }

//   return (
//     <div className="users-management">
//       <h2>Управление пользователями</h2>
//       <div className="grid">
//         {users.map((user) => (
//           <div className="card" key={user.id}>
//             <h3>{user.name}</h3>
//             <p className="text-secondary">{user.email}</p>
//             <p>Роль: {user.role}</p>
//             <div className="actions">
//               <button onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}>
//                 {user.role === 'admin' ? 'Сделать пользователем' : 'Сделать администратором'}
//               </button>
//               <button className="danger" onClick={() => handleBlockUser(user.id, user.isBlocked)}>
//                 {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// const AdminDashboard = () => {
//   const [value, setValue] = useState(0);
//   const navigate = useNavigate();

//   const handleChange = (newValue) => {
//     setValue(newValue);
//     switch (newValue) {
//       case 0:
//         navigate('/admin/tours');
//         break;
//       case 1:
//         navigate('/admin/bookings');
//         break;
//       case 2:
//         navigate('/admin/users');
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div className="container">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1>Панель администратора</h1>

//         <div className="tabs">
//           <button
//             className={value === 0 ? 'active' : ''}
//             onClick={() => handleChange(0)}
//           >
//             Туры
//           </button>
//           <button
//             className={value === 1 ? 'active' : ''}
//             onClick={() => handleChange(1)}
//           >
//             Бронирования
//           </button>
//           <button
//             className={value === 2 ? 'active' : ''}
//             onClick={() => handleChange(2)}
//           >
//             Пользователи
//           </button>
//         </div>

//         <Routes>
//           <Route path="tours" element={<ToursManagement />} />
//           <Route path="bookings" element={<BookingsManagement />} />
//           <Route path="users" element={<UsersManagement />} />
//           <Route path="*" element={<ToursManagement />} />
//         </Routes>
//       </motion.div>
//     </div>
//   );
// };

// export default AdminDashboard









import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {useNavigate, Routes, Route} from "react-router-dom"
import axios from "axios"
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Компонент для управления турами
const ToursManagement = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    price: '',
    duration: '',
    destination: '',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    isActive: true,
  });
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Получение всех туров
  const fetchTours = async () => {
    try {
      const res = await axios.get(`${API_URL}/tours?page=${page}&limit=${limit}`);
      setTours(res.data.tours);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page]);

  // Обработка изменения полей
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Обработка выбора картинок
  const handleImagesChange = e => {
    setImages(e.target.files);
  };

  // Отправка формы (создание или обновление)
  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/tours/${form.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_URL}/tours`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setForm({
        id: null,
        title: '',
        description: '',
        price: '',
        duration: '',
        destination: '',
        startDate: '',
        endDate: '',
        maxParticipants: '',
        isActive: true,
      });
      setImages([]);
      setEditing(false);
      fetchTours();
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Открыть модалку для создания тура
  const handleOpenCreate = () => {
    setForm({
      id: null,
      title: '',
      description: '',
      price: '',
      duration: '',
      destination: '',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      isActive: true,
    });
    setEditing(false);
    setImages([]);
    setModalOpen(true);
  };

  // Открыть модалку для редактирования тура
  const handleEdit = tour => {
    setForm({
      id: tour.id,
      title: tour.title,
      description: tour.description,
      price: tour.price,
      duration: tour.duration,
      destination: tour.destination,
      startDate: tour.startDate.split('T')[0],
      endDate: tour.endDate.split('T')[0],
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
    setEditing(false);
    setForm({
      id: null,
      title: '',
      description: '',
      price: '',
      duration: '',
      destination: '',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      isActive: true,
    });
    setImages([]);
  };

  // Удаление тура
  const handleDelete = async id => {
    if (!window.confirm('Удалить этот тур?')) return;
    try {
      await axios.delete(`${API_URL}/tours/${id}`);
      fetchTours();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tours-management">
      <div className="header">
        <h2>Управление турами</h2>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          Добавить тур
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Редактировать тур' : 'Добавить тур'}</h3>
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
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Направление</label>
                  <input
                    type="text"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Дата начала</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Дата окончания</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
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
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editing ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="tours-list">
        {tours.length === 0 && <p>Туров пока нет.</p>}
        <div className="tours-grid">
          {tours.map(tour => (
            <div key={tour.id} className="tour-card">
              <h3>{tour.title}</h3>
              <p className="tour-description">{tour.description}</p>
              <div className="tour-details">
                <p>Цена: {tour.price} ₽</p>
                <p>Длительность: {tour.duration} дней</p>
                <p>Направление: {tour.destination}</p>
                <p>С {new Date(tour.startDate).toLocaleDateString()} до {new Date(tour.endDate).toLocaleDateString()}</p>
                <p>Макс. участников: {tour.maxParticipants}</p>
                <p>Активен: {tour.isActive ? 'Да' : 'Нет'}</p>
              </div>
              {tour.images && (
                <div className="tour-images">
                  {tour.images.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000${img}`}
                      alt="Tour"
                      className="tour-image"
                    />
                  ))}
                </div>
              )}
              <div className="tour-actions">
                <button className="btn btn-outline" onClick={() => handleEdit(tour)}>
                  Редактировать
                </button>
                <button className="btn btn-outline btn-danger" onClick={() => handleDelete(tour.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Назад
          </button>
          <span>Страница {page} из {totalPages}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент для управления бронированиями
const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchBookings();
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      setError(error.response?.data?.message || 'Ошибка при обновлении статуса');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="bookings-management">
      <h2>Управление бронированиями</h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h3>Бронирование #{booking.id}</h3>
            <p>Тур: {booking.Tour.title}</p>
            <p>Клиент: {booking.User.name}</p>
            <p className={`status ${booking.status}`}>
              Статус: {booking.status}
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
    console.log(`Блокировка пользователя с id: ${userId}, текущий статус: ${currentStatus}`);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/${userId}/block`, 
        { isBlocked: !currentStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Ответ от сервера:', response.data);
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при блокировке пользователя:', error);
      setError(error.response?.data?.message || 'Ошибка при блокировке пользователя');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при изменении роли:', error);
      setError(error.response?.data?.message || 'Ошибка при изменении роли');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="users-management">
      <h2>Управление пользователями</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p className="user-email">{user.email}</p>
            <p>Роль: {user.role}</p>
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
    switch (newValue) {
      case 0:
        navigate('/admin/tours');
        break;
      case 1:
        navigate('/admin/bookings');
        break;
      case 2:
        navigate('/admin/users');
        break;
      default:
        break;
    }
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
          <button 
            className={`tab ${value === 0 ? 'active' : ''}`}
            onClick={() => handleTabChange(0)}
          >
            Туры
          </button>
          <button 
            className={`tab ${value === 1 ? 'active' : ''}`}
            onClick={() => handleTabChange(1)}
          >
            Бронирования
          </button>
          <button 
            className={`tab ${value === 2 ? 'active' : ''}`}
            onClick={() => handleTabChange(2)}
          >
            Пользователи
          </button>
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