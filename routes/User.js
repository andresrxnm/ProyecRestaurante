const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const router = express.Router();

// Middleware de validación para usuarios
const validateUser  = [
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
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Rutas para usuarios
router.get('/', UserController.index);
router.get('/create', UserController.create);
router.post('/usuarios', validateUser, UserController.store);
router.get('/:id', UserController.show);
router.get('/:id/edit', UserController.edit);
router.put('/:id', validateUser, UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;