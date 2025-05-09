const pool = require('../config/database');

class Recomendacion {
  // Obtener todas las recomendaciones
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, u.nombre AS nombre_usuario, rest.nombre AS nombre_restaurante
        FROM recomendaciones r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN restaurantes rest ON r.restaurante_id = rest.id
        ORDER BY r.fecha_recomendacion DESC
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener todas las recomendaciones:", error);
      throw error;
    }
  }

  // Obtener una recomendación por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM recomendaciones WHERE id = ?', [id]);
      return rows[0]; // Retorna el primer resultado si lo encuentra
    } catch (error) {
      console.error("Error al obtener la recomendación:", error);
      throw error;
    }
  }

  // Crear una nueva recomendación
  static async create(data) {
    try {
      const { usuario_id, restaurante_id, fecha_recomendacion } = data;
      
      // Convertir la fecha a formato datetime si no lo está
      const fecha = new Date(fecha_recomendacion).toISOString().slice(0, 19).replace('T', ' ');

      const query = `
        INSERT INTO recomendaciones (usuario_id, restaurante_id, fecha_recomendacion) 
        VALUES (?, ?, ?)
      `;
      const [result] = await pool.query(query, [usuario_id, restaurante_id, fecha]);
      return result.insertId;
    } catch (error) {
      console.error("Error al crear la recomendación:", error);
      throw error;
    }
  }

  // Actualizar una recomendación
  static async update(id, data) {
    try {
      const { usuario_id, restaurante_id, fecha_recomendacion } = data;

      // Convertir la fecha a formato datetime si no lo está
      const fecha = new Date(fecha_recomendacion).toISOString().slice(0, 19).replace('T', ' ');

      const query = `
        UPDATE recomendaciones 
        SET usuario_id = ?, restaurante_id = ?, fecha_recomendacion = ? 
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [usuario_id, restaurante_id, fecha, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar la recomendación:", error);
      throw error;
    }
  }

  // Eliminar una recomendación
  static async delete(id) {
    try {
      const query = 'DELETE FROM recomendaciones WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar la recomendación:", error);
      throw error;
    }
  }
}

module.exports = Recomendacion;
