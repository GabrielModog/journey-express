import fs from 'fs';
import path from 'path';

/**
 * Garante que o diretório de logs existe
 * Esta função deve ser chamada antes de inicializar o logger
 */

export const ensureLogsDirectory = (): void => {
  const logsDir = path.join(process.cwd(), 'logs');
  
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}; 