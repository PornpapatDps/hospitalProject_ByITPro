const { Pool } = require('pg');
require('dotenv').config();

// คอนฟิกการเชื่อมต่อ postgresql ภายในเครือข่าย LAN
    // const pool = new pg.Client({
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
const pool = new Pool({
  host: 'smartg.trueddns.com',
  port: 29454,
  user: 'admin',
  database: 'hospital',
  password: 'admin1234',
  max: 10,
  idleTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('🔥 PostgreSQL Pool error:', err.message);
});

module.exports = pool;