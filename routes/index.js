let usuariosRoutes = require('./usuarios.routes.js')
let indexRoutes = require('./index.routes.js')  

var express = require("express");
var router = express.Router();


//Middleware de autenticacion por niveles y logueo
  


/* GET home page. */
router.get("/", function (req, res, next) {

  
  res.render("index", { title: "INICIO" });
  let usuariostorage = JSON.parse(localStorage.getItem("nombre"));
  console.log(usuariostorage.logged);
  console.log(usuariostorage.usuario);
  console.log(usuariostorage.level);


  
});

router.get("/ebook", function (req, res, next) {
  res.render("ebook", { title: "EBOOK" });
});
router.get("/informacion", function (req, res, next) {
  res.render("informacion", { title: "INFORMACION" });
});

router.get("/catalogo", function (req, res, next) {
  res.render("catalogo", { title: "CATALOGO" });
});

router.get("/iniciosesion", function (req, res, next) {
  res.render("iniciosesion", { title: "iniciosesion" });
});

router.get("/libro", function (req, res, next) {
  res.render("libro", { title: "LIBRO" });
});


router.get("/administrador", function (req, res, next) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  let usuariostorage = JSON.parse(localStorage.getItem("nombre"));

  console.log(usuariostorage.logged);
  console.log(usuariostorage.usuario);
  console.log(usuariostorage.level);


  if (usuariostorage.logged && usuariostorage.level === 2) {
    return res.render("administrador", { title: "ADMINISTRADOR" });
  } else {
    return res.render("iniciosesion", { title: "INICIOSESION" });
  }
});


//auth pages
router.get("/alumno", function (req, res, next) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  let usuariostorage = JSON.parse(localStorage.getItem("nombre"));

  console.log(usuariostorage.logged);
  console.log(usuariostorage.usuario);
  console.log(usuariostorage.level);


  if (usuariostorage.logged && usuariostorage.level === 3) {
    return res.render("alumno", { title: "ALUMNO" });
  } else {
    return res.render("iniciosesion", { title: "INICIOSESION" });
  }
});


router.get("/cerrarsesion", function (req, res, next) {
  console.log('Se cierra sesion');
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
  localStorage.clear();
  res.render("iniciosesion", { title: "INICIOSESION" });
});


//Api Rest (Aqui ponemos las rutas)
router.use('/api',usuariosRoutes)
router.use(indexRoutes)


module.exports = router;
