import { Request, Response, NextFunction } from 'express';
import { logError } from '../../core/utils/logger';

/**
 * Middleware para capturar e registrar erros não tratados
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Registrar o erro
  logError(err, {
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip || req.connection.remoteAddress || 'unknown'
  });

  // Responder com um erro 500
  res.status(500).json({ error: 'Internal server error' });
}; 