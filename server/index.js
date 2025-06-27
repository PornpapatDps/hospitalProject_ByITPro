const { InfluxDB } = require('@influxdata/influxdb-client');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');

const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  CORS: เพื่อให้ React ติดต่อได้พร้อม cookie
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // URL Frontend
  credentials: true                //  สำคัญ: อนุญาตให้ส่ง cookie
}));
app.use(express.json());
app.use(cookieParser());
//  SESSION (ถ้าใช้ session-based auth เพิ่มได้)
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret1',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 1000 * 60 * 60 }
// }));

//  ROUTES
const hospitalRoutes = require('./routes/hospitalAPI');
const authRoutes = require('./routes/auth');

app.use('/hospital', hospitalRoutes);
app.use('/auth', authRoutes);
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

//  START
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
