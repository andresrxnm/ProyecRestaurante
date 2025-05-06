const pool = require('../config/database');

class Menu {
  // Obtener todos los menús
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT m.*, r.nombre AS nombre_restaurante
        FROM Menus m
        JOIN Restaurantes r ON m.restaurante_id = r.id
        ORDER BY m.id DESC
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener todos los menús:", error);
      throw error;
    }
  }

  // Obtener menús de un restaurante específico
  static async getAllByRestaurante(restaurante_id) {
    try {
      const [rows] = await pool.query('SELECT * FROM Menus WHERE restaurante_id = ?', [restaurante_id]);
      return rows;
    } catch (error) {
      console.error("Error al obtener menús del restaurante:", error);
      throw error;
    }
  }

  // Obtener un menú por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM Menus WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error("Error al obtener el menú:", error);
      throw error;
    }
  }

  // Crear un nuevo menú
  static async create(data) {
    try {
      const { restaurante_id, nombre_plato, descripcion, precio } = data;
      const query = `
        INSERT INTO Menus (restaurante_id, nombre_plato, descripcion, precio) 
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [restaurante_id, nombre_plato, descripcion, precio]);
      return result.insertId;
    } catch (error) {
      console.error("Error al crear el menú:", error);
      throw error;
    }
  }

  // Actualizar un menú
  static async update(id, data) {
    try {
      const { nombre_plato, descripcion, precio } = data;
      const query = `
        UPDATE Menus 
        SET nombre_plato = ?, descripcion = ?, precio = ? 
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [nombre_plato, descripcion, precio, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar el menú:", error);
      throw error;
    }
  }

  // Eliminar un menú
  static async delete(id) {
    try {
      const query = 'DELETE FROM Menus WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar el menú:", error);
      throw error;
    }
  }
}

module.exports = Menu;