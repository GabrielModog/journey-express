import { Request, Response } from 'express';
import Joi from 'joi';

import { ActionType } from '../../core/domain/action';
import { IActionService } from '../../core/services/interfaces/action-service.interface';

const actionSchema = Joi.object({
  type: Joi.string().valid(...Object.values(ActionType)).required(),
  config: Joi.object().required(),
  order: Joi.number().integer().min(1).required(),
  delayMinutes: Joi.number().integer().min(0).required()
});

export class ActionController {
  constructor(private actionService: IActionService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = actionSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const action = await this.actionService.createAction(value);
      res.status(201).json(action);
    } catch (error) {
      console.error('Error ao criar action:', error);
      res.status(500).json({ error: 'Error ao criar action' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const action = await this.actionService.getActionById(req.params.id);
      if (!action) {
        res.status(404).json({ error: 'Action not found' });
        return;
      }
      res.status(200).json(action);
    } catch (error) {
      console.error('Falha ao achar action por ID:', error);
      res.status(500).json({ error: 'Falha ao achar action por ID' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const actions = await this.actionService.getAllActions();
      res.status(200).json(actions);
    } catch (error) {
      console.error('Erro ao listar actions:', error);
      res.status(500).json({ error: 'Erro ao listar action' });
    }
  }
} 