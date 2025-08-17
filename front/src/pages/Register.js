// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
// import { register, clearError } from '../store/slices/authSlice';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [passwordError, setPasswordError] = useState('');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/');
//     }
//     return () => {
//       dispatch(clearError());
//     };
//   }, [isAuthenticated, navigate, dispatch]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     if (e.target.name === 'confirmPassword') {
//       setPasswordError(
//         e.target.value !== formData.password ? 'Пароли не совпадают' : ''
//       );
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       setPasswordError('Пароли не совпадают');
//       return;
//     }
//     const { confirmPassword, ...registerData } = formData;
//     dispatch(register(registerData));
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
//             Регистрация
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
//               id="name"
//               label="Имя"
//               name="name"
//               autoComplete="name"
//               autoFocus
//               value={formData.name}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email"
//               name="email"
//               autoComplete="email"
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
//               autoComplete="new-password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="confirmPassword"
//               label="Подтвердите пароль"
//               type="password"
//               id="confirmPassword"
//               autoComplete="new-password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               error={!!passwordError}
//               helperText={passwordError}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading || !!passwordError}
//             >
//               {loading ? 'Регистрация...' : 'Зарегистрироваться'}
//             </Button>
//             <Box sx={{ textAlign: 'center' }}>
//               <Link component={RouterLink} to="/login" variant="body2">
//                 Уже есть аккаунт? Войдите
//               </Link>
//             </Box>
//           </Box>
//         </Paper>
//       </motion.div>
//     </Container>
//   );
// };

// export default Register; 




import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { register, clearError } from '../store/slices/authSlice';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'confirmPassword') {
      setPasswordError(
        e.target.value !== formData.password ? 'Пароли не совпадают' : ''
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    const { confirmPassword, ...registerData } = formData;
    dispatch(register(registerData));
  };

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="paper">
          <h1 className="title-register">Регистрация</h1>
          {error && (
            <div className="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Имя"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Пароль"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Подтвердите пароль"
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={passwordError ? 'input-error' : ''}
            />
            {passwordError && (
              <div className="helper-text">{passwordError}</div>
            )}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !!passwordError}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <div className="link-container">
              <RouterLink to="/login" className="link">
                Уже есть аккаунт? Войдите
              </RouterLink>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
