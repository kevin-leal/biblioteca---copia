let express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

router.get('/usuarios', usuariosController.getUsuarios)

router.get('/usuarios/:id', usuariosController.getUsuario)

router.post('/usuarios', usuariosController.createUsuarios)

router.patch('/usuarios/:id', usuariosController.updateUsuarios)

router.delete('/usuarios/:id', usuariosController.deleteUsuarios)

module.exports = router;