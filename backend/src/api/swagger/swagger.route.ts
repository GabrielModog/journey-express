import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './swagger.config';

export function createSwaggerRoutes(): Router {
  const router = Router();

  // Rotas da documentação do Swagger
  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Documentação da API de Jornadas'
  }));

  // Rotas de especificação OpenAPI em formato JSON
  router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  return router;
} 