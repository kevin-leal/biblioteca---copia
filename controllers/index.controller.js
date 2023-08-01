const connection = require('../database/db.js');

const ping = async (req, res) => {
    const [result] = await connection.query('SELECT "Pong" as result')
    res.json(result[0])
}
module.exports = {
ping,
}