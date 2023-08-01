const mysql = require('mysql2/promise')

const connection=mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'libreria'
});

(async () => {
    try {
        await connection.query('SELECT 1'); // Test the connection
        console.log('Conectamos a la base de datos!');
    } catch (error) {
        console.error('El error en la base de datos es:', error.message);
    }
})();

module.exports = connection;