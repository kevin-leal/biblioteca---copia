var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "INICIO" });
});

//GET register page
router.get("/register", function (req, res, next) {
  res.render("register", { title: "REGISTRO" });
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

module.exports = router;
