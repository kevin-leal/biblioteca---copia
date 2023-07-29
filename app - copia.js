const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'your-secret-key';
const dbConfig = {
  host: 'localhost',
  user: 'your-mysql-username',
  password: 'your-mysql-password',
  database: 'user_management'
};

// Middleware para parsear el cuerpo de las peticiones a JSON
app.use(bodyParser.json());

// Middleware para proteger las rutas que requieren autorización
const requireAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó un token de autorización.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido.' });
  }
};

// Middleware para verificar el nivel de usuario
const requireLevel = (level) => {
  return (req, res, next) => {
    if (req.user.level === level) {
      next();
    } else {
      res.status(403).json({ error: 'No tienes permisos suficientes para acceder a esta ruta.' });
    }
  };
};

// Conexión a la base de datos
const connection = mysql.createConnection(dbConfig);

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
  const { username, password, level } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error al cifrar la contraseña:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }

    const user = {
      username: username,
      password: hashedPassword,
      level: level
    };

    connection.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        console.error('Error al crear el usuario:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }

      res.json({ message: 'Usuario registrado exitosamente.' });
    });
  });
});

// Ruta para autenticar al usuario y obtener un token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (bcryptErr, bcryptRes) => {
      if (bcryptErr) {
        console.error('Error al comparar contraseñas:', bcryptErr);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }

      if (!bcryptRes) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, level: user.level }, secretKey);
      res.json({ token });
    });
  });
});

// Rutas protegidas que requieren autorización y nivel de usuario específico
app.get('/admin', requireAuth, requireLevel('admin'), (req, res) => {
  res.json({ message: 'Bienvenido, administrador.' });
});

app.get('/user', requireAuth, requireLevel('user'), (req, res) => {
  res.json({ message: 'Bienvenido, usuario.' });
});

// Ruta predeterminada para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
