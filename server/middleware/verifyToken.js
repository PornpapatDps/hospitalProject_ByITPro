const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'TokenExpired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};



module.exports = verifyToken;
