const pool = require('../database/db_api');

const ping = async (req, res) => {
    const [result] = await pool.query('SELECT "Pong" as result')
    res.json(result[0])
}
module.exports = {
ping,
}