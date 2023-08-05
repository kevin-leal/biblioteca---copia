const mysql = require('mysql2/promise')

const pool=mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'libreria'
});

(async () => {
    try {
        await pool.query('SELECT 1'); // Test the connection
        console.log('API conectada a base de datos exitosamente!');
    } catch (error) {
        console.error('El error en la base de datos (API) es:', error.message);
    }
})();

module.exports = pool;