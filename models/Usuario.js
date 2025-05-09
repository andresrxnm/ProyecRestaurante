const pool = require('../config/database'); // Asegúrate de que tienes esta conexión a la base de datos configurada

class Usuario {

  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM usuarios'
      );
      return rows;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw new Error('Error al obtener los usuarios');
    }
  }


  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  }

  static async create(usuario) {
    try {
      const { nombre, apellido, email, contraseña } = usuario;
      const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, apellido, email, contrasena) VALUES (?, ?, ?, ?)',
        [nombre, apellido, email, contraseña]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  static async update(id, usuario) {
    try {
      const { nombre, apellido, email, contraseña } = usuario;
      const [result] = await pool.query(
        'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, contrasena = ? WHERE id = ?',
        [nombre, apellido, email, contraseña, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  }


}

module.exports = Usuario;