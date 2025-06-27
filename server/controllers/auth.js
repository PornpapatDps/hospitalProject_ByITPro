const pg = require('../postgresql/pgAdmin4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  try{
    const { email, password, role } = req.body
    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const existingUser = await pg.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    // บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
    const result = await pg.query(
      `INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING user_id, email, role`,
      [email, hashedPassword, role]
    );
    const newUser = result.rows[0];
    // สร้าง JWT token
    const token = jwt.sign(
      { userId: newUser.user_id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
      sameSite: 'Lax',
      maxAge: 1 * 60 * 60 * 1000 // 1 ชม.
    });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { userId: newUser.user_id, email: newUser.email, role: newUser.role }
    });
    
  }catch (error) {
    console.log('Error in register:', error);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};
// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const result = await pg.query(
      `SELECT user_id, email, password, role FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // ส่ง token กลับไปยัง client
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
      sameSite: 'Lax',
      maxAge: 1 * 60 * 60 * 1000  // 1 ชม.
    });

    res.json({
      message: 'Login successful',
      token,
      user: { userId: user.user_id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.log('Error in login:', error);
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
}
// Get all users
const users = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded user:', decoded);

    const results = await pg.query(`SELECT * FROM users`);
    res.json({
      users: results.rows
    });

  } catch (error) {
    console.log('Error in users:', error);
    res.status(403).json({
      message: 'Authorization failed',
      error: error.message
    });
  }
};
// Logout user
const logout = async (req, res) => {
  await res.clearCookie('token');
  await res.clearCookie('refreshToken');
  await res.json({ message: 'ออกจากระบบเรียบร้อยแล้ว' });
};

// EXPORT
module.exports = { register,login,users,logout };
