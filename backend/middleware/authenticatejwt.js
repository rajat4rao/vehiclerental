const jwt = require('jsonwebtoken');

async function authenticatejwt(req, res, next) {
    const token = req.cookies.jwt;
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      next(); 
    } catch (err) {
      //console.error("JWT verification error:", err); 
      return res.status(403).json({ message: 'Forbidden' });
    }
  }

module.exports = authenticatejwt;