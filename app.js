var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup urlcoded para enlazar datos de formulario
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Invocar a dotenv 
const dotenv= require('dotenv');
dotenv.config({path:'./env/.env'});

//Invocar a  Bcrypt
const bcryptjs = require('bcryptjs');

//Variables de session
const session = require('express-session');
app.use(session({
  secret:'secret',
  resave: true,
  saveUninitialized: true
}));

//Invocamos modulo de conexion base de datos
const connection = require('./database/db');
const { error } = require('console');

//Register
app.post('/register',async(req, res)=>{
  const nombre = req.body.nombre;
  const matricula = req.body.matricula;
  const correo = req.body.correo;
  const tipo_usuario = req.body.tipo_usuario;
  const password = req.body.password;
  let passwordHaash = await bcryptjs.hash(password, 8);
  connection.query('INSERT INTO usuario SET ?',{nombre:nombre, matricula:matricula, correo:correo, tipo_usuario:tipo_usuario, password: passwordHaash},async(error, results)=>{
     if (error) {
      console.log(error);
     }else{
      res.render('iniciosesion',{
        alert:true,
        alertTitle: "REGISTRO",
        alertMessage: "REGISTRO EXITOSO",
        alertIcon:"success",
        showConfirmButton: false,
        timer: 1500,
        ruta:'iniciosesion'
      });
     }
  })
  
})

//Autenticacion 
app.post('/auth', async (req, res)=>{
  const correo = req.body.correo;
  const password = req.body.password;
  let passwordHaash = await bcryptjs.hash(password, 8);
  if (correo && password) {
    connection.query('SELECT * FROM usuario WHERE correo = ?',[correo], async (error, results)=>{
      
      if (results.length == 0 || !(await bcryptjs.compare(password, results[0].password))) {
        res.render('iniciosesion',{
          alert:true,
          alertTitle: "Error",
          alertMessage: "USUARIO O PASSWORD INCORRECTOS",
          alertIcon:"error",
          showConfirmButton: true,
          timer: false,
          ruta:'iniciosesion'
        });
      }else{

        if (typeof localStorage === "undefined" || localStorage === null) {
          var LocalStorage = require('node-localstorage').LocalStorage;
          localStorage = new LocalStorage('./scratch');
        }
        
        nivelusuario= results[0].tipo_usuario;

        let persona={
          usuario:correo,
          logged: true,
          level: nivelusuario,
        };

        localStorage.setItem("nombre", JSON.stringify(persona));
        console.log(persona);

        if (nivelusuario === 3) {
          res.render('alumno',{
            alert:true,
            alertTitle: "Conexion exitosa",
            alertMessage: "BIENVENIDO",
            alertIcon:"success",
            showConfirmButton: false,
            timer: 1500,
            ruta:'alumno'
          });
        }

        if (nivelusuario === 2) {
          res.render('administrador',{
            alert:true,
            alertTitle: "Conexion exitosa",
            alertMessage: "BIENVENIDO",
            alertIcon:"success",
            showConfirmButton: false,
            timer: 1500,
            ruta:'administrador'
          });
        }

        if (nivelusuario === 1) {
          res.render('superadministrador',{
            alert:true,
            alertTitle: "Conexion exitosa",
            alertMessage: "BIENVENIDO",
            alertIcon:"success",
            showConfirmButton: false,
            timer: 1500,
            ruta:'superadministrador'
          });
        }

        

      }
    })
  }else{
    res.render('iniciosesion',{
      alert:true,
      alertTitle: "Advertencia",
      alertMessage: "POR FAVOR INGRESE USUARIO O PASSWORD",
      alertIcon:"warning",
      showConfirmButton: true,
      timer: 1500,
      ruta:'iniciosesion'
    });

  }

})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
