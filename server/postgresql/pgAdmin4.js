const { Pool } = require('pg');
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
// const db = new pg.Pool({
//   host: 'smartg.trueddns.com',
//   port: 29454,
//   user: 'admin',
//   database: 'hospital',
//   password: 'admin1234',
//   connectionString: process.env.PG_URI,
//   idleTimeoutMillis: 10000, // ป้องกัน idle connection
// });

const pool = new Pool({
  host: process.env.DB_HOST ,
  port:  5432,
  user: process.env.DB_USER ,
  password: '123456',
  database:  'hospital',
  max: 10, // จำนวน connection สูงสุดใน pool
  idleTimeoutMillis: 30000, // connection idle 30 วิแล้วตัด
  connectionTimeoutMillis: 2000 // รอ connect 2 วิ
});

// ทดสอบการเชื่อมต่อ
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL (Local)');
    client.release(); // ปล่อย connection กลับ pool
  })
  .catch(err => {
    console.error('❌ Connection error:', err.message);
  });

pool.on('error', (err) => {
  console.error('🔥 PostgreSQL pool error:', err.message);
});

module.exports = pool;