const db = require('../postgresql/pgAdmin4.js');

const getDevices = async (req, res) => {
    try{
        const response  = await db.query('SELECT * FROM devices');
        const result = response.rows;
        res.status(200).json({
            status: 'success',
            data: {
                devices: result
            }
        });
    }catch(err){
        console.error('Error:', err);
        res.status(500).json({ message: 'Failed to fetch devices data' });
    }
}

module.exports = { getDevices };