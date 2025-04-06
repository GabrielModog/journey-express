import { config } from 'dotenv';
import express from "express"
import Bull from 'bull';
import mongoose from 'mongoose';

import { ensureLogsDirectory } from './core/utils/ensure-logs-directory';
import { createJornadaRoutes } from './api/routes/jornada.routes';
import { JornadaController } from './api/controllers/jornada.controller';
import { JornadaService } from './core/services/jornada.service';
import { ActionController } from './api/controllers/action.controller';
import { ActionService } from './core/services/action.service';
import { createActionRoutes } from './api/routes/action.route';
import { ColaboradorController } from './api/controllers/colaborador.controller';
import { ColaboradorService } from './core/services/colaborador.service';
import { createColaboradorRoutes } from './api/routes/colaborador.route';
import { requestLogger } from './api/middlewares/request-logger.middleware';
import { errorHandler } from './api/middlewares/error-handler.middleware';
import { VinculoJornadaController } from './api/controllers/vincular-jornada.controller';
import { createVinculoJornadaRoutes } from './api/routes/vinculo-jornada.route';
import { logDbConnection } from './core/utils/logger';

config()
ensureLogsDirectory()

const app = express()

// Inicialização de middlewares
app.use(express.json())
app.use(requestLogger)

const PORT = process.env.BACKEND_PORT || 3001

// Inicialização do MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evacopilot')
  .then(() => {
    console.log('Connected to MongoDB');
    logDbConnection('evacopilot', 'connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    logDbConnection('evacopilot', 'error', err);
  });

// Inicialização da Queue
const queue = new Bull("action-queue", {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
})

// Inicialização de controllers
const actionController = new ActionController(new ActionService())
const jornadaController = new JornadaController(new JornadaService())
const colaboradorController = new ColaboradorController(new ColaboradorService())
const vinculoJornadaController = new VinculoJornadaController(queue)

// Configuração de rotas
app.use("/api/actions", createActionRoutes(actionController))
app.use("/api/jornadas", createJornadaRoutes(jornadaController))
app.use("/api/colaboradores", createColaboradorRoutes(colaboradorController))
app.use("/api/vincular-jornada", createVinculoJornadaRoutes(vinculoJornadaController))

// Error middleware
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});