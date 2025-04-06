import { Router } from 'express';
import { ColaboradorController } from '../controllers/colaborador.controller';

export function createColaboradorRoutes(
  colaboradorController: ColaboradorController
): Router {
  const router = Router();

  router.post('/', (req, res) => colaboradorController.create(req, res));
  router.get('/', (req, res) => colaboradorController.getAll(req, res));
  router.get('/:id', (req, res) => colaboradorController.getById(req, res));

  return router;
} 