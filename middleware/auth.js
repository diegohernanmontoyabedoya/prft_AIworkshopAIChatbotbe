const jwt = require('jsonwebtoken');
//const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_SECRET = process.env.JWT_SECRET;


module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid auth header' });
  }
  try {
    // Verify the JWT token
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    // just in case we need more info in the error validation
    /*jwt.verify(auth.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
        } else {
            console.log('JWT successfully decoded:', decoded);
            // You can now access the payload data, e.g., decoded.userId
        }
    });*/
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};