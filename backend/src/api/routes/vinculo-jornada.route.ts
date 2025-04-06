import { Router } from 'express';

import { VinculoJornadaController } from '../controllers/vincular-jornada.controller';

export function createVinculoJornadaRoutes(
  vinculoJornadaController: VinculoJornadaController
): Router {
  const router = Router();

  router.post('/vincular', (req, res) => vinculoJornadaController.assignJourney(req, res));
  router.get('/', (req, res) => vinculoJornadaController.getAll(req, res));
  router.get('/:id', (req, res) => vinculoJornadaController.getById(req, res));

  return router;
} 