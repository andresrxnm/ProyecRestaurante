const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");

// Mostrar todos los usuarios
exports.index = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();  // Obtenemos todos los usuarios de la base de datos
    res.render('usuarios/index', { 
      title: 'Listado de Usuarios',
      usuarios: usuarios  // Pasamos los datos de los usuarios a la vista
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Hubo un error al cargar los usuarios.' 
    });
  }
};


// Guardar nuevo estudiante
exports.store = async (req, res) => {
  // Validar datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("usuarios/form", {
      title: "Registrar Usuario",
      usuario: req.body,
      errors: errors.array(),
      isEditing: false,
    });
  }

  try {
    await Usuario.create(req.body);
    res.redirect("/usuarios");
  } catch (error) {
    console.error(error);
    res.render("usuarios/form", {
      title: "Registrar usuarios",
      usuario: req.body,
      errors: [
        {
          msg: "Error al guardar el usuarios. El email podría estar duplicado.",
        },
      ],
      isEditing: false,
    });
  }
};

// Actualizar estudiante
exports.update = async (req, res) => {
  // Validar datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("usuarios/form", {
      title: "Editar usuario",
      usuario: { ...req.body, id: req.params.id },
      errors: errors.array(),
      isEditing: true,
    });
  }

  try {
    const success = await Usuario.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render("error", {
        title: "Error",
        message: "usuario no encontrado",
      });
    }
    res.redirect("/usuarios");
  } catch (error) {
    console.error(error);
    res.render("usuarios/form", {
      title: "Editar usuario",
      usuario: { ...req.body, id: req.params.id },
      errors: [
        {
          msg: "Error al actualizar el usuario. El email podría estar duplicado.",
        },
      ],
      isEditing: true,
    });
  }
};

// Eliminar estudiante
exports.delete = async (req, res) => {
  try {
    const success = await Usuario.delete(req.params.id);
    if (!success) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    res.redirect("/usuarios");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar el usuario" });
  }
};



// Mostrar formulario para crear nuevo estudiante
exports.create = async (req, res) => {
  res.render("usuarios/form", {
    title: "Registrar usuario",
    usuario: {},
    errors: [],
    isEditing: false,
  });
};

// Mostrar formulario para editar estudiante
exports.edit = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) {
      return res.status(404).render("error", {
        title: "Error",
        message: "usuario no encontrado",
      });
    }
    res.render("usuarios/form", {
      title: "Editar Estudiante",
      usuario,
      errors: [],
      isEditing: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar los datos del usaurio",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Usuario no encontrado",
      });
    }
    res.render("usuarios/show", {
      title: "Detalle del Usuario",
      usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar el usuario",
    });
  }
};