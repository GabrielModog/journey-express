import { Router } from 'express';
import { ActionController } from '../controllers/action.controller';

export function createActionRoutes(
  actionController: ActionController
): Router {
  const router = Router();

  router.post('/', (req, res) => actionController.create(req, res));
  router.get('/', (req, res) => actionController.getAll(req, res));
  router.get('/:id', (req, res) => actionController.getById(req, res));

  return router;
} 