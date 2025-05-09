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

  async filtrarRestaurantes(filtros) {
    let query = `
      SELECT 
        r.*,
        ROUND(AVG(res.calificacion), 1) AS calificacion_promedio,
        MIN(m.precio) AS precio_minimo
      FROM Restaurantes r
      LEFT JOIN Resenas res ON r.id = res.restaurante_id
      LEFT JOIN Menus m ON r.id = m.restaurante_id
      WHERE 1=1
    `;
    const params = [];
  
    // Agregar filtros dinámicamente
    if (filtros.tipoCocina) {
      query += ' AND r.tipo_cocina = ?';
      params.push(filtros.tipoCocina);
    }
  
    if (filtros.ubicacion) {
      query += ' AND r.ubicacion = ?';
      params.push(filtros.ubicacion);
    }
  
    if (filtros.precio) {
      // Verifica que el valor sea un número
      const precio = Number(filtros.precio);
      if (!isNaN(precio)) {
        query += ' AND m.precio <= ?';
        params.push(precio);
      }
    }
  
    // Agrupar por restaurante
    query += ' GROUP BY r.id';
  
    // Agregar filtro por calificación (después de GROUP BY)
    if (filtros.calificacion) {
      const calificacion = Number(filtros.calificacion);
      if (!isNaN(calificacion)) {
        query += ' HAVING calificacion_promedio >= ?';
        params.push(calificacion);
      }
    }
  
    try {
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error al filtrar restaurantes:', error);
      throw error;
    }
  }
  
  async obtenerFiltrosUnicos() {
    const [tipos] = await pool.query('SELECT DISTINCT tipo_cocina FROM Restaurantes WHERE tipo_cocina IS NOT NULL');
    const [ubicaciones] = await pool.query('SELECT DISTINCT ubicacion FROM Restaurantes WHERE ubicacion IS NOT NULL');
  
    return {
      tiposCocina: tipos.map(row => row.tipo_cocina),
      ubicaciones: ubicaciones.map(row => row.ubicacion)
    };
  }
  

}

module.exports = Restaurante;