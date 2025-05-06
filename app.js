const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');

// Rutas
const UsuarioRoutes = require('./routes/usuarios');
const RestauranteRoutes = require('./routes/restaurantes'); 
const resenasRoutes = require('./routes/resenas');
const menuRoutes = require('./routes/menus');
const recomendacionesRoutes = require('./routes/recomendaciones');

// Inicializar la aplicación
const app = express();
const PORT = process.env.PORT || 7000;

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // Para soportar PUT y DELETE en formularios


// Rutas
app.use('/restaurantes', RestauranteRoutes); 
app.use('/usuarios', UsuarioRoutes);
app.use('/resenas', resenasRoutes);
app.use('/menus', menuRoutes);
app.use('/recomendaciones', recomendacionesRoutes);  // Asegúrate de tener esta línea

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { title: 'Sistema de Gestión De Restaurnate' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});