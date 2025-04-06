import { config } from 'dotenv';
import express from "express"

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

config()
ensureLogsDirectory()

const app = express()
app.use(express.json())
app.use(requestLogger)

const PORT = process.env.BACKEND_PORt || 3001

// Inicialização de controllers
const actionController = new ActionController(new ActionService())
const jornadaController = new JornadaController(new JornadaService())
const colaboradorController = new ColaboradorController(new ColaboradorService())

// Configuração de rotas
app.use("/api/actions", createActionRoutes(actionController))
app.use("/api/jornadas", createJornadaRoutes(jornadaController))
app.use("/api/jornadas", createColaboradorRoutes(colaboradorController))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});