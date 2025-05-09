const pool = require('../config/database');

class Resena {
  // Obtener todas las reseñas
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, u.nombre AS nombre_usuario, rest.nombre AS nombre_restaurante
        FROM resenas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN restaurantes rest ON r.restaurante_id = rest.id
        ORDER BY r.fecha_creacion DESC
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener todas las reseñas:", error);
      throw error;
    }
  }

  // Obtener todas las reseñas de un restaurante específico
  static async getAllByRestaurante(restaurante_id) {
    try {
      const [rows] = await pool.query('SELECT * FROM resenas WHERE restaurante_id = ?', [restaurante_id]);
      return rows;
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
      throw error;
    }
  }

  // Obtener una reseña por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM resenas WHERE id = ?', [id]);
      return rows[0]; // Retorna el primer resultado si lo encuentra
    } catch (error) {
      console.error("Error al obtener la reseña:", error);
      throw error;
    }
  }

  // Crear una nueva reseña
  static async create(data) {
    try {
      const { usuario_id, restaurante_id, calificacion, comentario, fecha_creacion } = data;
      const query = `
        INSERT INTO resenas (usuario_id, restaurante_id, calificacion, comentario, fecha_creacion) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [usuario_id, restaurante_id, calificacion, comentario, fecha_creacion]);
      return result.insertId;
    } catch (error) {
      console.error("Error al crear la reseña:", error);
      throw error;
    }
  }

  // Actualizar una reseña
  static async update(id, data) {
    try {
      const { calificacion, comentario } = data;
      const query = `
        UPDATE resenas 
        SET calificacion = ?, comentario = ? 
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [calificacion, comentario, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar la reseña:", error);
      throw error;
    }
  }

  // Eliminar una reseña
  static async delete(id) {
    try {
      const query = 'DELETE FROM resenas WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
      throw error;
    }
  }
}

module.exports = Resena;
