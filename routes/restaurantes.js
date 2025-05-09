const express = require('express');
const { body } = require('express-validator');
const restauranteController = require('../controllers/RestauranteController');
const router = express.Router();

// Middleware de validación para restaurantes
const validateRestaurante = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('tipo_cocina')
    .notEmpty().withMessage('El tipo de cocina es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El tipo de cocina debe tener entre 2 y 100 caracteres'),
  body('ubicacion')
    .notEmpty().withMessage('La ubicación es obligatoria')
    .isLength({ min: 2, max: 100 }).withMessage('La ubicación debe tener entre 2 y 100 caracteres'),
  body('telefono')
    .notEmpty().withMessage('El telefono es obligatorio'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres')
];

// Rutas para restaurantes
router.get('/', restauranteController.index);  // Listar todos los restaurantes
router.get('/create', restauranteController.create);  // Mostrar el formulario para crear un restaurante
router.post('/', validateRestaurante, restauranteController.store);  // Crear nuevo restaurante
router.get('/:id', restauranteController.show);  // Mostrar los detalles de un restaurante
router.get('/:id/edit', restauranteController.edit);  // Mostrar el formulario para editar un restaurante
router.put('/:id', validateRestaurante, restauranteController.update);  // Actualizar un restaurante
router.delete('/:id', restauranteController.delete);  // Eliminar un restaurante
//router.get('/', restauranteController.listarFiltrados);

module.exports = router;