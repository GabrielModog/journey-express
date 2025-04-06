import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../../core/utils/logger';

/**
 * Middleware para registrar informações sobre as requisições HTTP
 * Registra o método, caminho, IP e tempo de resposta
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logRequest(req.method, req.originalUrl, ip, duration);
  });
  
  next();
}; 