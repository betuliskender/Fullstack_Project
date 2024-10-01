import jwt from 'jsonwebtoken';

const authMiddleware = (req) => {
    const token = req.headers.authorization || '';
    if (!token) {
      return { user: null }; // Allow unauthenticated access (for register and login)
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decodedToken };
    } catch (error) {
      return { user: null }; // Invalid token; treat as unauthenticated
    }
  };
  
  export default authMiddleware;
  