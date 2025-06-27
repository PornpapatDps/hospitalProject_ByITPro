// node generateEnv.js
const fs = require('fs');
const crypto = require('crypto');

// สร้าง secret แบบปลอดภัย
const generateSecret = () => crypto.randomBytes(64).toString('hex');

// เนื้อหา .env
const envContent = `

INFLUX_URL=http://192.168.1.76:8086
INFLUX_TOKEN=my01o26Ty7xNnJEXQobUYn_B8FsrpSIsJFsHi4zaadVT_8DRrQg5OeFOvZDNK_Vdj9WRx0rkrGpzuPhs7j3lVA==
INFLUX_ORG=smartg
INFLUX_BUCKET=Hospital

DB_HOST=localhost
DB_USER=postgres
DB_NAME=hostpital
DB_PASSWORD=123456
DB_PORT=5432 

DB_URL=postgresql://postgres:123456@localhost:5432/hospital
JWT_SECRET=${generateSecret()}

ACCESS_SECRET=${generateSecret()}
REFRESH_SECRET=${generateSecret()}

`.trim();

fs.writeFileSync('.env', envContent);

console.log('✅ .env created successfully!');
