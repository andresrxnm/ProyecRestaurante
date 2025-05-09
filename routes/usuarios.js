const express = require('express');
const { body } = require('express-validator');
const usuarioController = require('../controllers/UsuarioController');
const router = express.Router();

// Middleware de validación para estudiantes
const validateUsuario = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ingresar un email válido'),
  body('contraseña')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 4, max: 20 }).withMessage('La carrera debe tener entre 4 y 20 caracteres')
];



// Rutas para estudiantes
router.get('/', usuarioController.index);
router.get('/create', usuarioController.create);
router.post('/', validateUsuario, usuarioController.store);
router.get('/:id', usuarioController.show);
router.get('/:id/edit', usuarioController.edit);
router.put('/:id', validateUsuario, usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;