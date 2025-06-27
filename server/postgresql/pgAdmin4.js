const pg = require('pg');
require('dotenv').config();
// คอนฟิกการเชื่อมต่อ postgresql ภายในเครือข่าย LAN
    // const db = new pg.Client({
    //     host: '192.168.1.76',
    //     user: 'admin',
    //     database: 'hospital',
    //     password: 'admin1234',
    //     port: '5432'
    // //    max: 10, // จำนวน connection สูงสุด
    // // idleTimeoutMillis: 30000, // 30 วินาที
    // // connectionTimeoutMillis: 2000 // รอเชื่อมต่อ 2 วิ
    // })

// เชื่อมต่อฐานข้อมูล  DDNS
const db = new pg.Client({
  host: 'smartg.trueddns.com',
  port: 29454,
  user: 'admin',
  database: 'hospital',
  password: 'admin1234',
  connectionString: process.env.PG_URI,
  idleTimeoutMillis: 10000, // ป้องกัน idle connection
});

db.connect()
// ป้องกัน server ล่มถ้า DB มีปัญหา
db.on('error', err => {
  console.error('PostgreSQL client error:', err.message);
  // ยังไม่ throw error ต่อ เพื่อกัน server ตาย
});

module.exports = db 