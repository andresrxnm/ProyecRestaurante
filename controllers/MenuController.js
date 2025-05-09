const { validationResult } = require("express-validator");
const Menu = require("../models/Menu"); // Asegúrate de que la ruta sea correcta

// Mostrar todos los menús
exports.index = async (req, res) => {
  try {
    const menus = await Menu.getAll();
    res.render("menus/index", {
      title: "Listado de Menús",
      menus
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Hubo un error al cargar los menús."
    });
  }
};

// Mostrar formulario para crear un nuevo menú
exports.create = (req, res) => {
  res.render("menus/form", {
    title: "Registrar Menú",
    menu: {},
    errors: [],
    isEditing: false
  });
};

// Guardar nuevo menú
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("menus/form", {
      title: "Registrar Menú",
      menu: req.body,
      errors: errors.array(),
      isEditing: false
    });
  }

  try {
    await Menu.create(req.body);
    res.redirect("/menus");
  } catch (error) {
    console.error(error);
    res.render("menus/form", {
      title: "Registrar Menú",
      menu: req.body,
      errors: [{ msg: "Error al guardar el menú. Verifica los datos ingresados." }],
      isEditing: false
    });
  }
};

// Mostrar formulario para editar un menú
exports.edit = async (req, res) => {
  try {
    const menu = await Menu.getById(req.params.id);
    if (!menu) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Menú no encontrado"
      });
    }
    res.render("menus/form", {
      title: "Editar Menú",
      menu,
      errors: [],
      isEditing: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar los datos del menú"
    });
  }
};

// Actualizar menú
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("menus/form", {
      title: "Editar Menú",
      menu: { ...req.body, id: req.params.id },
      errors: errors.array(),
      isEditing: true
    });
  }

  try {
    const success = await Menu.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Menú no encontrado"
      });
    }
    res.redirect("/menus");
  } catch (error) {
    console.error(error);
    res.render("menus/form", {
      title: "Editar Menú",
      menu: { ...req.body, id: req.params.id },
      errors: [{ msg: "Error al actualizar el menú. Verifica los datos ingresados." }],
      isEditing: true
    });
  }
};

// Eliminar menú
exports.delete = async (req, res) => {
  try {
    const success = await Menu.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Menú no encontrado" });
    }
    res.redirect("/menus");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar el menú" });
  }
};

// Mostrar detalles de un menú
exports.show = async (req, res) => {
  try {
    const menu = await Menu.getById(req.params.id);
    if (!menu) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Menú no encontrado"
      });
    }
    res.render("menus/show", {
      title: "Detalle del Menú",
      menu
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al cargar el menú"
    });
  }
};
