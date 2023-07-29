var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "INICIO" });
  
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
  res.render("administrador", { title: "iniciosesion" });
});


//auth pages
router.get("/alumno", function (req, res, next) {
  res.render("alumno", { title: "iniciosesion" });
});



module.exports = router;
