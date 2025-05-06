const express = require('express');
const { body } = require('express-validator');
const recomendacionController = require('../controllers/RecomendacionController');
const router = express.Router();

// Middleware de validación para recomendaciones
const validateRecomendacion = [
  body('usuario_id')
    .notEmpty().withMessage('El ID del usuario es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero positivo'),
  body('restaurante_id')
    .notEmpty().withMessage('El ID del restaurante es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del restaurante debe ser un número entero positivo'),
  body('fecha_recomendacion')
    .notEmpty().withMessage('La fecha de la recomendación es obligatoria')
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).withMessage('La fecha debe ser en un formato válido (YYYY-MM-DDTHH:mm)'),
];

// Rutas para recomendaciones
router.get('/', recomendacionController.index);  // Listar todas las recomendaciones
router.get('/create', recomendacionController.create);  // Mostrar formulario para crear recomendación
router.post('/', validateRecomendacion, recomendacionController.store);  // Guardar recomendación
router.get('/:id', recomendacionController.show);  // Mostrar detalle de una recomendación
router.get('/:id/edit', recomendacionController.edit);  // Mostrar formulario para editar recomendación
router.put('/:id', validateRecomendacion, recomendacionController.update);  // Actualizar recomendación
router.delete('/:id', recomendacionController.delete);  // Eliminar recomendación

module.exports = router;
