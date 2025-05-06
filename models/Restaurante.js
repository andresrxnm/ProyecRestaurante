const pool = require('../config/database');

class Restaurante {
  // Obtener todos los restaurantes
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM restaurantes');
      return rows;
    } catch (error) {
      console.error("Error al obtener los restaurantes:", error);
      throw error;
    }
  }


  // Obtener un restaurante por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM restaurantes WHERE id = ?', [id]);
      return rows[0]; // Retorna el primer resultado si lo encuentra
    } catch (error) {
      console.error("Error al obtener el restaurante:", error);
      throw error;
    }
  }

  // Crear un nuevo restaurante
  static async create(data) {
    try {
      const { nombre, tipo_cocina, ubicacion, telefono, descripcion } = data;
      const query = `
        INSERT INTO restaurantes (nombre, tipo_cocina, ubicacion, telefono, descripcion) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [nombre, tipo_cocina, ubicacion, telefono, descripcion]);
      return result.insertId; // Retorna el id del nuevo restaurante creado
    } catch (error) {
      console.error("Error al crear el restaurante:", error);
      throw error;
    }
  }

  // Actualizar un restaurante
  static async update(id, data) {
    try {
      const { nombre, tipo_cocina, ubicacion, telefono, descripcion } = data;
      const query = `
        UPDATE restaurantes 
        SET nombre = ?, tipo_cocina = ?, ubicacion = ?, telefono = ?, descripcion = ? 
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [nombre, tipo_cocina, ubicacion, telefono, descripcion, id]);
      return result.affectedRows > 0; // Si se actualizó al menos un restaurante
    } catch (error) {
      console.error("Error al actualizar el restaurante:", error);
      throw error;
    }
  }

  // Eliminar un restaurante
  static async delete(id) {
    try {
      const query = 'DELETE FROM restaurantes WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0; // Si se eliminó al menos un restaurante
    } catch (error) {
      console.error("Error al eliminar el restaurante:", error);
      throw error;
    }
  }
}

module.exports = Restaurante;