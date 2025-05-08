const { validationResult } = require("express-validator");
const Restaurante = require("../models/Restaurante"); // Asegúrate de que la ruta es correcta

// Mostrar todos los restaurantes
exports.index = async (req, res) => {
  try {
    const restaurantes = await Restaurante.getAll();  // Obtenemos todos los restaurantes de la base de datos
    res.render('restaurantes/index', { 
      title: 'Listado de restaurantes',
      restaurantes: restaurantes  // Pasamos los datos de los restaurantes a la vista
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Hubo un error al cargar los restaurantes.' 
    });
  }
};


// Guardar nuevo restaurante
exports.store = async (req, res) => {
  // Validar datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("restaurantes/form", {
      title: "Registrar restaurante",
      restaurante: req.body,
      errors: errors.array(),
      isEditing: false,
    });
  }

  try {
    await Restaurante.create(req.body);
    res.redirect("/restaurantes");
  } catch (error) {
    console.error(error);
    res.render("restaurantes/form", {
      title: "Registrar restaurante",
      restaurante: req.body,
      errors: [
        {
          msg: "Error al guardar el restaurante. El nombre podría estar duplicado.",
        },
      ],
      isEditing: false,
    });
  }
};

// Actualizar restaurante
exports.update = async (req, res) => {
  // Validar datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("restaurantes/form", {
      title: "Editar restaurante",
      restaurante: { ...req.body, id: req.params.id },
      errors: errors.array(),
      isEditing: true,
    });
  }

  try {
    const success = await Restaurante.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Restaurante no encontrado",
      });
    }
    res.redirect("/restaurantes");
  } catch (error) {
    console.error(error);
    res.render("restaurantes/form", {
      title: "Editar restaurante",
      restaurante: { ...req.body, id: req.params.id },
      errors: [
        {
          msg: "Error al actualizar el restaurante. El nombre podría estar duplicado.",
        },
      ],
      isEditing: true,
    });
  }
};

// Eliminar restaurante
exports.delete = async (req, res) => {
  try {
    const success = await Restaurante.delete(req.params.id);
    if (!success) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurante no encontrado" });
    }
    res.redirect("/restaurantes");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar el restaurante" });
  }
};

// Mostrar formulario para crear nuevo restaurante
exports.create = async (req, res) => {
  res.render("restaurantes/form", {
    title: "Registrar restaurante",
    restaurante: {},
    errors: [],
    isEditing: false,
  });
};

// Mostrar formulario para editar restaurante
exports.edit = async (req, res) => {
  try {
    const restaurante = await Restaurante.getById(req.params.id);
    if (!restaurante) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Restaurante no encontrado",
      });
    }
    res.render("restaurantes/form", {
      title: "Editar restaurante",
      restaurante,
      errors: [],
      isEditing: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar los datos del restaurante",
    });
  }
};

// Mostrar detalles de un restaurante
exports.show = async (req, res) => {
  try {
    const restaurante = await Restaurante.getById(req.params.id);
    if (!restaurante) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Restaurante no encontrado",
      });
    }
    res.render("restaurantes/show", {
      title: "Detalle del Restaurante",
      restaurante
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar el restaurante",
    });
  }
};

exports.filter = async (req, res) => {
  const filtros = {
    tipoCocina: req.query.tipoCocina || null,
    ubicacion: req.query.ubicacion || null,
    precio: req.query.precio || null,
    calificacion: req.query.calificacion || null
  };

  try {
    const [restaurantes, filtrosUnicos] = await Promise.all([
      Restaurante.filtrarRestaurantes(filtros),
      Restaurante.obtenerFiltrosUnicos()
    ]);

    res.render('restaurantes/index', {
      title: 'Restaurantes filtrados',
      restaurantes,
      filtros,
      tiposCocina: filtrosUnicos.tiposCocina,
      ubicaciones: filtrosUnicos.ubicaciones
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Hubo un error al aplicar los filtros.'
    });
  }
};