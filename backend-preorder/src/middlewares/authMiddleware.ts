import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.header('Authorization'); // Atau req.headers.authorization
  
  if (!authHeader) {
    return res.status(401).json({ message: "Akses Ditolak! Anda harus login terlebih dahulu." });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Akses Ditolak! Format token tidak valid." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_negara_123');
    req.user = verified; 
    next(); 
  } catch (error) {
    res.status(403).json({ message: "Token tidak valid atau sudah kedaluwarsa!" });
  }
};
