const { name } = require('ejs');
const connection = require('../database/db.js');

// OBTENER TODOS LOS USUARIOS
const getUsuarios = async (req, res) => {
    try{
        const [rows] = await connection.query('SELECT * FROM usuario')
        res.json(rows)
    } catch (error){
        return res.status(500).json({
            message: 'Algo ha salido mal :('
        })
    }
}
 //ej postman get http://localhost:3000/api/usuarios

// OBTENER USUARIO POR ID
const getUsuario = async (req, res) => {
   try{
        const [rows] = await connection.query('SELECT * FROM usuario WHERE id_usuario = ?', [req.params.id])
        if (rows.length <= 0) return res.status(404).json({
            message: 'Usuario no encontrado :('
        })
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha salido mal :('
        })
    }
}
 //ej postman get  //ej postman get http://localhost:3000/api/usuarios/(id_del_usuario)
   

// INSERTAR USUARIOS
const createUsuarios = async (req, res) => {
    const {nombre,matricula,correo,password,tipo_usuario} = req.body

    try {
        const [rows] = await connection.query('INSERT INTO usuario(nombre, matricula, correo, password, tipo_usuario) VALUES(?,?,?,?,?)',[nombre,matricula,correo,password,tipo_usuario])

        res.send({
            id: rows.insertId,
            nombre,
            matricula,
            correo,
            password,
            tipo_usuario
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha salido mal :('
        })
    }
}

// ELIMINAR USUARIOS
const deleteUsuarios = async (req, res) => {
    try {
        const [result] = await connection.query('DELETE FROM usuario WHERE id_usuario = ?',[req.params.id])
        console.log(result)
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Usuario no encontrado :('
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha salido mal :('
        })
    }
}

// ACTUALIZAR USUARIOS
const updateUsuarios = async (req, res) => {
    const {id} = req.params
    const {nombre,matricula,correo,password,tipo_usuario} = req.body

    try {
        const [result] = await connection.query('UPDATE usuario SET nombre = IFNULL(?, nombre), matricula = IFNULL(?, matricula), correo = IFNULL(?, correo), password = IFNULL(?, password), tipo_usuario = IFNULL(?, tipo_usuario) WHERE id_usuario = ?',[nombre, matricula, correo, password, tipo_usuario, id])

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Usuario no encontrado :('
        })

        const [rows] = await connection.query('SELECT * FROM usuario WHERE id_usuario = ?', [id])

        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Algo ha salido mal :('
        })
    }
}



module.exports = {
  getUsuarios,
  getUsuario,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios,
}



