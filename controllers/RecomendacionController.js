const { validationResult } = require("express-validator");
const Recomendacion = require("../models/Recomendacion"); // Asegúrate de que esta ruta sea correcta

// Mostrar todas las recomendaciones
exports.index = async (req, res) => {
  try {
    const recomendaciones = await Recomendacion.getAll();
    res.render('recomendaciones/index', {
      title: 'Listado de recomendaciones',
      recomendaciones
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Hubo un error al cargar las recomendaciones.'
    });
  }
};

// Guardar nueva recomendación
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("recomendaciones/form", {
      title: "Registrar recomendación",
      recomendacion: req.body,
      errors: errors.array(),
      isEditing: false,
    });
  }

  // Convertir la fecha de recomendación a formato correcto
  if (req.body.fecha_recomendacion) {
    req.body.fecha_recomendacion = new Date(req.body.fecha_recomendacion).toISOString().slice(0, 19).replace('T', ' ');
  }

  try {
    await Recomendacion.create(req.body);
    res.redirect("/recomendaciones");
  } catch (error) {
    console.error(error);
    res.render("recomendaciones/form", {
      title: "Registrar recomendación",
      recomendacion: req.body,
      errors: [
        {
          msg: "Error al guardar la recomendación. Verifica los datos ingresados.",
        },
      ],
      isEditing: false,
    });
  }
};

// Actualizar recomendación
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("recomendaciones/form", {
      title: "Editar recomendación",
      recomendacion: { ...req.body, id: req.params.id },
      errors: errors.array(),
      isEditing: true,
    });
  }

  // Convertir la fecha de recomendación a formato correcto
  if (req.body.fecha_recomendacion) {
    req.body.fecha_recomendacion = new Date(req.body.fecha_recomendacion).toISOString().slice(0, 19).replace('T', ' ');
  }

  try {
    const success = await Recomendacion.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Recomendación no encontrada",
      });
    }
    res.redirect("/recomendaciones");
  } catch (error) {
    console.error(error);
    res.render("recomendaciones/form", {
      title: "Editar recomendación",
      recomendacion: { ...req.body, id: req.params.id },
      errors: [
        {
          msg: "Error al actualizar la recomendación. Verifica los datos ingresados.",
        },
      ],
      isEditing: true,
    });
  }
};

// Eliminar recomendación
exports.delete = async (req, res) => {
  try {
    const success = await Recomendacion.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Recomendación no encontrada" });
    }
    res.redirect("/recomendaciones");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar la recomendación" });
  }
};

// Mostrar formulario para crear nueva recomendación
exports.create = (req, res) => {
  res.render("recomendaciones/form", {
    title: "Registrar recomendación",
    recomendacion: {},
    errors: [],
    isEditing: false,
  });
};

// Mostrar formulario para editar recomendación
exports.edit = async (req, res) => {
  try {
    const recomendacion = await Recomendacion.getById(req.params.id);
    if (!recomendacion) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Recomendación no encontrada",
      });
    }

    // Aseguramos que la fecha esté en el formato correcto
    const fechaRecomendacion = new Date(recomendacion.fecha_recomendacion);
    recomendacion.fecha_recomendacion = isNaN(fechaRecomendacion.getTime()) 
      ? new Date().toISOString().slice(0, 16) // Fecha válida predeterminada
      : fechaRecomendacion.toISOString().slice(0, 16);

    res.render("recomendaciones/form", {
      title: "Editar recomendación",
      recomendacion,
      errors: [],
      isEditing: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar los datos de la recomendación",
    });
  }
};

// Mostrar detalles de una recomendación
exports.show = async (req, res) => {
  try {
    const recomendacion = await Recomendacion.getById(req.params.id);
    if (!recomendacion) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Recomendación no encontrada",
      });
    }
    res.render("recomendaciones/show", {
      title: "Detalle de la recomendación",
      recomendacion
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar la recomendación",
    });
  }
};
