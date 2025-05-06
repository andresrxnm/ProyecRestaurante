const { validationResult } = require("express-validator");
const Resena = require("../models/Resena"); // Asegúrate de que esta ruta sea correcta

// Mostrar todas las reseñas
exports.index = async (req, res) => {
  try {
    const resenas = await Resena.getAll();
    res.render('resenas/index', {
      title: 'Listado de reseñas',
      resenas
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Hubo un error al cargar las reseñas.'
    });
  }
};

// Guardar nueva reseña
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("resenas/form", {
      title: "Registrar reseña",
      resena: req.body,
      errors: errors.array(),
      isEditing: false,
    });
  }

  try {
    await Resena.create(req.body);
    res.redirect("/resenas");
  } catch (error) {
    console.error(error);
    res.render("resenas/form", {
      title: "Registrar reseña",
      resena: req.body,
      errors: [
        {
          msg: "Error al guardar la reseña. Verifica los datos ingresados.",
        },
      ],
      isEditing: false,
    });
  }
};

// Actualizar reseña
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("resenas/form", {
      title: "Editar reseña",
      resena: { ...req.body, id: req.params.id },
      errors: errors.array(),
      isEditing: true,
    });
  }

  try {
    const success = await Resena.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Reseña no encontrada",
      });
    }
    res.redirect("/resenas");
  } catch (error) {
    console.error(error);
    res.render("resenas/form", {
      title: "Editar reseña",
      resena: { ...req.body, id: req.params.id },
      errors: [
        {
          msg: "Error al actualizar la reseña. Verifica los datos ingresados.",
        },
      ],
      isEditing: true,
    });
  }
};

// Eliminar reseña
exports.delete = async (req, res) => {
  try {
    const success = await Resena.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }
    res.redirect("/resenas");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar la reseña" });
  }
};

// Mostrar formulario para crear nueva reseña
exports.create = (req, res) => {
  res.render("resenas/form", {
    title: "Registrar reseña",
    resena: {},
    errors: [],
    isEditing: false,
  });
};

// Mostrar formulario para editar reseña
exports.edit = async (req, res) => {
  try {
    const resena = await Resena.getById(req.params.id);
    if (!resena) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Reseña no encontrada",
      });
    }
    res.render("resenas/form", {
      title: "Editar reseña",
      resena,
      errors: [],
      isEditing: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar los datos de la reseña",
    });
  }
};

// Mostrar detalles de una reseña
exports.show = async (req, res) => {
  try {
    const resena = await Resena.getById(req.params.id);
    if (!resena) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Reseña no encontrada",
      });
    }
    res.render("resenas/show", {
      title: "Detalle de la Reseña",
      resena
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar la reseña",
    });
  }
};
