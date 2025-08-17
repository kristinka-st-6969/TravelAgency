// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Link,
//   Paper,
//   Alert
// } from '@mui/material';
// import { motion } from 'framer-motion';
// import { login, clearError } from '../store/slices/authSlice';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const from = location.state?.from?.pathname || '/';
//       navigate(from, { replace: true });
//     }
//     return () => {
//       dispatch(clearError());
//     };
//   }, [isAuthenticated, navigate, dispatch, location]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(login(formData));
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             marginTop: 8,
//             padding: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center'
//           }}
//         >
//           <Typography component="h1" variant="h5">
//             Вход
//           </Typography>
//           {error && (
//             <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
//               {error}
//             </Alert>
//           )}
//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Пароль"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading}
//             >
//               {loading ? 'Вход...' : 'Войти'}
//             </Button>
//             <Box sx={{ textAlign: 'center' }}>
//               <Link component={RouterLink} to="/register" variant="body2">
//                 Нет аккаунта? Зарегистрируйтесь
//               </Link>
//             </Box>
//           </Box>
//         </Paper>
//       </motion.div>
//     </Container>
//   );
// };

// export default Login; 





import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { login, clearError } from '../store/slices/authSlice';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="container-login">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="paper">
          <h1 className="title-login">Вход</h1>
          {error && <div className="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input"
              autoComplete="email"
              autoFocus
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              required
              value={formData.password}
              onChange={handleChange}
              className="input"
              autoComplete="current-password"
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
            <div className="link-container">
              <RouterLink to="/register" className="link">
                Нет аккаунта? Зарегистрируйтесь
              </RouterLink>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
