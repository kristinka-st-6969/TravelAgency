// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Box,
//   Paper
// } from '@mui/material';
// import { motion } from 'framer-motion';

// const Home = () => {
//   const navigate = useNavigate();

//   const features = [
//     {
//       title: 'Широкий выбор туров',
//       description: 'Более 100 направлений по всему миру',
//       icon: '🌍'
//     },
//     {
//       title: 'Лучшие цены',
//       description: 'Гарантия лучшей цены на рынке',
//       icon: '💰'
//     },
//     {
//       title: 'Поддержка 24/7',
//       description: 'Всегда на связи с вами',
//       icon: '📞'
//     }
//   ];

//   const popularDestinations = [
//     {
//       title: 'Париж',
//       image: '/images/paris.jpg',
//       description: 'Романтическая столица Франции'
//     },
//     {
//       title: 'Рим',
//       image: '/images/rome.jpg',
//       description: 'Вечный город'
//     },
//     {
//       title: 'Токио',
//       image: '/images/tokyo.jpg',
//       description: 'Современный мегаполис'
//     }
//   ];

//   return (
//     <Box>
//       {/* Hero Section */}
//       <Paper
//         className="card fade-in"
//         sx={{
//           position: 'relative',
//           backgroundColor: 'grey.800',
//           color: '#fff',
//           mb: 4,
//           backgroundSize: 'cover',
//           backgroundRepeat: 'no-repeat',
//           backgroundPosition: 'center',
//           backgroundImage: 'url(/images/hero-bg.jpg)',
//           height: { xs: '40vh', md: '60vh' },
//           display: 'flex',
//           alignItems: 'center',
//           borderRadius: 4,
//           overflow: 'hidden',
//         }}
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             bottom: 0,
//             right: 0,
//             left: 0,
//             backgroundColor: 'rgba(0,0,0,.5)'
//           }}
//         />
//         <Container
//           sx={{
//             position: 'relative',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             textAlign: 'center'
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Typography
//               component="h1"
//               variant="h2"
//               color="inherit"
//               gutterBottom
//               sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
//             >
//               Откройте для себя мир
//             </Typography>
//             <Typography variant="h5" color="inherit" paragraph sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
//               Путешествуйте с нами и создавайте незабываемые воспоминания
//             </Typography>
//             <Button
//               variant="contained"
//               size="large"
//               className="button-main"
//               onClick={() => navigate('/tours')}
//               sx={{ mt: 2 }}
//             >
//               Найти тур
//             </Button>
//           </motion.div>
//         </Container>
//       </Paper>

//       {/* Features Section */}
//       <Container sx={{ py: 8 }}>
//         <Grid container spacing={4}>
//           {features.map((feature, index) => (
//             <Grid item xs={12} md={4} key={index}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//               >
//                 <Card
//                   sx={{
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     textAlign: 'center',
//                     p: 3
//                   }}
//                 >
//                   <Typography variant="h1" sx={{ mb: 2 }}>
//                     {feature.icon}
//                   </Typography>
//                   <Typography variant="h5" component="h2" gutterBottom>
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="body1" color="text.secondary">
//                     {feature.description}
//                   </Typography>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Popular Destinations */}
//       <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
//         <Container>
//           <Typography variant="h4" component="h2" gutterBottom align="center">
//             Популярные направления
//           </Typography>
//           <Grid container spacing={4} sx={{ mt: 2 }}>
//             {popularDestinations.map((destination, index) => (
//               <Grid item xs={12} md={4} key={index}>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                   <Card
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       cursor: 'pointer',
//                       '&:hover': {
//                         transform: 'scale(1.02)',
//                         transition: 'transform 0.2s ease-in-out'
//                       }
//                     }}
//                     onClick={() => navigate('/tours')}
//                   >
//                     <CardMedia
//                       component="img"
//                       height="200"
//                       image={destination.image}
//                       alt={destination.title}
//                     />
//                     <CardContent>
//                       <Typography gutterBottom variant="h5" component="h2">
//                         {destination.title}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {destination.description}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Call to Action */}
//       <Container sx={{ py: 8 }}>
//         <Paper
//           sx={{
//             p: 6,
//             textAlign: 'center',
//             bgcolor: 'primary.main',
//             color: 'white'
//           }}
//         >
//           <Typography variant="h4" gutterBottom>
//             Готовы начать путешествие?
//           </Typography>
//           <Typography variant="body1" paragraph>
//             Присоединяйтесь к нам и откройте для себя новые горизонты
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             onClick={() => navigate('/tours')}
//             sx={{
//               bgcolor: 'white',
//               color: 'primary.main',
//               '&:hover': {
//                 bgcolor: 'grey.100'
//               }
//             }}
//           >
//             Найти идеальный тур
//           </Button>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default Home; 


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
