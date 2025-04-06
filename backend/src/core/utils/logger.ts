import winston from 'winston';

// Configuração do logger

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'jornada-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export const logRequest = (method: string, path: string, ip: string, duration?: number) => {
  logger.info('HTTP Request', { method, path, ip, duration: duration ? `${duration}ms` : undefined });
};

export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error(error.message, { 
    error: error.stack, 
    ...context 
  });
};

export const logDbConnection = (dbName: string, status: 'connected' | 'disconnected' | 'error', error?: Error) => {
  if (status === 'error' && error) {
    logger.error(`Database connection ${status}`, { dbName, error: error.message });
  } else {
    logger.info(`Database connection ${status}`, { dbName });
  }
};

export const logRedisConnection = (status: 'connected' | 'disconnected' | 'error', error?: Error) => {
  if (status === 'error' && error) {
    logger.error(`Redis connection ${status}`, { error: error.message });
  } else {
    logger.info(`Redis connection ${status}`);
  }
};

export const logActionExecution = (actionId: string, jornadaId: string, status: 'started' | 'completed' | 'failed', error?: Error) => {
  if (status === 'failed' && error) {
    logger.error(`Action execution ${status}`, { actionId, jornadaId, error: error.message });
  } else {
    logger.info(`Action execution ${status}`, { actionId, jornadaId });
  }
};

export default logger; 