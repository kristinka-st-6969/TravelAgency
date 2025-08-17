// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   AppBar,
//   Box,
//   Toolbar,
//   IconButton,
//   Typography,
//   Menu,
//   Container,
//   Avatar,
//   Button,
//   Tooltip,
//   MenuItem,
//   useMediaQuery,
//   useTheme,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Home as HomeIcon,
//   Explore as ExploreIcon,
//   Person as PersonIcon,
//   AdminPanelSettings as AdminIcon,
//   Login as LoginIcon,
//   Logout as LogoutIcon
// } from '@mui/icons-material';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../store/slices/authSlice';

// const Layout = ({ children }) => {
//   const [anchorElUser, setAnchorElUser] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);

//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   const menuItems = [
//     { text: 'Главная', icon: <HomeIcon />, path: '/' },
//     { text: 'Туры', icon: <ExploreIcon />, path: '/tours' },
//   ];

//   if (isAuthenticated) {
//     menuItems.push(
//       { text: 'Профиль', icon: <PersonIcon />, path: '/profile' }
//     );
//     if (user?.role === 'admin') {
//       menuItems.push(
//         { text: 'Админ панель', icon: <AdminIcon />, path: '/admin' }
//       );
//     }
//   }

//   const drawer = (
//     <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
//       <List>
//         {menuItems.map((item) => (
//           <ListItem
//             button
//             key={item.text}
//             onClick={() => navigate(item.path)}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.text} />
//           </ListItem>
//         ))}
//         {isAuthenticated ? (
//           <ListItem button onClick={handleLogout}>
//             <ListItemIcon><LogoutIcon /></ListItemIcon>
//             <ListItemText primary="Выйти" />
//           </ListItem>
//         ) : (
//           <ListItem button onClick={() => navigate('/login')}>
//             <ListItemIcon><LoginIcon /></ListItemIcon>
//             <ListItemText primary="Войти" />
//           </ListItem>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <AppBar position="fixed">
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             {isMobile && (
//               <IconButton
//                 color="inherit"
//                 aria-label="open drawer"
//                 edge="start"
//                 onClick={handleDrawerToggle}
//                 sx={{ mr: 2 }}
//               >
//                 <MenuIcon />
//               </IconButton>
//             )}

//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
//             >
//               Туристическое агентство
//             </Typography>

//             {!isMobile && (
//               <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
//                 {menuItems.map((item) => (
//                   <Button
//                     key={item.text}
//                     onClick={() => navigate(item.path)}
//                     sx={{ my: 2, color: 'white', display: 'block' }}
//                     startIcon={item.icon}
//                   >
//                     {item.text}
//                   </Button>
//                 ))}
//               </Box>
//             )}

//             {isAuthenticated ? (
//               <Box sx={{ flexGrow: 0 }}>
//                 <Tooltip title="Открыть меню">
//                   <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                     <Avatar alt={user?.name} src={user?.avatar} />
//                   </IconButton>
//                 </Tooltip>
//                 <Menu
//                   sx={{ mt: '45px' }}
//                   id="menu-appbar"
//                   anchorEl={anchorElUser}
//                   anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   keepMounted
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   open={Boolean(anchorElUser)}
//                   onClose={handleCloseUserMenu}
//                 >
//                   <MenuItem onClick={() => {
//                     handleCloseUserMenu();
//                     navigate('/profile');
//                   }}>
//                     <Typography textAlign="center">Профиль</Typography>
//                   </MenuItem>
//                   <MenuItem onClick={() => {
//                     handleCloseUserMenu();
//                     handleLogout();
//                   }}>
//                     <Typography textAlign="center">Выйти</Typography>
//                   </MenuItem>
//                 </Menu>
//               </Box>
//             ) : (
//               <Button
//                 color="inherit"
//                 onClick={() => navigate('/login')}
//                 startIcon={<LoginIcon />}
//               >
//                 Войти
//               </Button>
//             )}
//           </Toolbar>
//         </Container>
//       </AppBar>

//       <Box
//         component="nav"
//         sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
//       >
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: 'block', md: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
//           }}
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - 240px)` },
//           mt: 8
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default Layout; 






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Layout.css'; // файл со стилями
import UserImg from '../images/user-icon_white.svg'

const Layout = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Главная', path: '/' },
    { text: 'Туры', path: '/tours' },
  ];

  if (isAuthenticated) {
    menuItems.push({ text: 'Профиль', path: '/profile' });
    if (user?.role === 'admin') {
      menuItems.push({ text: 'Админ панель', path: '/admin' });
    }
  }

  return (
    <div className="layout">
      <header className="app-bar">
        <div className="toolbar">
          <button className="menu-icon" onClick={() => setMobileOpen(!mobileOpen)}>
            ☰
          </button>
          <div className="title" onClick={() => navigate('/')}>
            ГЛОРИЯ
          </div>
          <nav className="desktop-menu">
            {menuItems.map((item) => (
              <button key={item.text} onClick={() => navigate(item.path)} className="nav-button">
                 {item.text}
              </button>
            ))}
          </nav>
          {isAuthenticated ? (
            <div className="user-section">
              <div className="avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                <img src={UserImg} style={{"fill":"white"}} alt="user" />
              </div>
              {showUserMenu && (
                <div className="user-menu animate-fade">
                  <div onClick={() => { setShowUserMenu(false); navigate('/profile'); }}>Профиль</div>
                  <div onClick={() => { setShowUserMenu(false); handleLogout(); }}>Выйти</div>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={() => navigate('/login')}>
              🔑 Войти
            </button>
          )}
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-drawer animate-slide">
          {menuItems.map((item) => (
            <div key={item.text} className="drawer-item" onClick={() => { setMobileOpen(false); navigate(item.path); }}>
             {item.text}
            </div>
          ))}
          {isAuthenticated ? (
            <div className="drawer-item" onClick={() => { setMobileOpen(false); handleLogout(); }}>
              Выйти
            </div>
          ) : (
            <div className="drawer-item" onClick={() => { setMobileOpen(false); navigate('/login'); }}>
              Войти
            </div>
          )}
        </div>
      )}

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
