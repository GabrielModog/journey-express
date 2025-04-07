import { Request, Response } from 'express';
import Joi from 'joi';

import { ActionType } from '../../core/domain/action';
import { IActionService } from '../../core/services/interfaces/action-service.interface';

const actionSchema = Joi.object({
  type: Joi.string().valid(...Object.values(ActionType)).required(),
  order: Joi.number().integer().min(1).required(),
  delayMinutes: Joi.number().integer().min(0).required()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Action:
 *       type: object
 *       required:
 *         - type
 *         - order
 *         - delayMinute
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the action
 *         type:
 *           type: string
 *           enum: [EMAIL, WHATSAPP, API_CALL]
 *           description: The type of the action
 *         order:
 *           type: number
 *           description: order
 *         delayMinute:
 *           type: number
 *           description: delayMinute
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 */
export class ActionController {
  constructor(private actionService: IActionService) { }

  /**
   * @swagger
   * /api/actions:
   *   post:
   *     summary: Create a new action
   *     tags: [Actions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - order
   *               - delayMinute
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the action
   *               type:
   *                 type: string
   *                 enum: [EMAIL, WHATSAPP, API_CALL]
   *                 description: The type of the action
   *               order:
   *                  type: number
   *               delayMinute:
   *                  type: number
   *     responses:
   *       201:
   *         description: Action created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Action'
   *       400:
   *         description: Invalid request body
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /api/actions/{id}:
   *   get:
   *     summary: Get an action by ID
   *     tags: [Actions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Action ID
   *     responses:
   *       200:
   *         description: Action found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Action'
   *       404:
   *         description: Action not found
   *       500:
   *         description: Server error
   */
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

  /**
  * @swagger
  * /api/actions:
  *   get:
  *     summary: Get all actions
  *     tags: [Actions]
  *     responses:
  *       200:
  *         description: List of actions
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Action'
  *       500:
  *         description: Server error
  */
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