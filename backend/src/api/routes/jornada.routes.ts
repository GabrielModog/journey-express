import { Router } from 'express';
import { JornadaController } from '../controllers/jornada.controller';

export function createJornadaRoutes(
  jornadaController: JornadaController
): Router {
  const router = Router();

  router.post('/', (req, res) => jornadaController.create(req, res));
  router.get('/', (req, res) => jornadaController.getAll(req, res));
  router.get('/:id', (req, res) => jornadaController.getById(req, res));

  return router;
} 