import { Request, Response } from 'express';
import Joi from 'joi';
import { Queue } from 'bull';

import { VinculoJornadaService } from '../../core/services/vinculo-jornada.service';

const assignJourneySchema = Joi.object({
  colaboradorId: Joi.string().required(),
  jornadaId: Joi.string().required(),
  startDate: Joi.date().iso().required()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     JourneyAssignment:
 *       type: object
 *       required:
 *         - employee
 *         - journey
 *         - startDate
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the journey assignment
 *         employee:
 *           type: string
 *           description: The ID of the employee
 *         journey:
 *           type: string
 *           description: The ID of the journey
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date of the journey assignment
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *           description: The status of the journey assignment
 *         currentActionIndex:
 *           type: number
 *           description: The index of the current action in the journey
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 */
export class VinculoJornadaController {
  private vinculoJornada: VinculoJornadaService;

  constructor(queue: Queue) {
    this.vinculoJornada = new VinculoJornadaService(queue)
  }

    /**
   * @swagger
   * /api/vincular-jornada:
   *   post:
   *     summary: Vincular Jornada ao um Colaborador
   *     tags: [Vincular Jornada]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - colaboradorId
   *               - jornadaId
   *               - startDate
   *             properties:
   *               colaboradorId:
   *                 type: string
   *                 description: The ID of the employee
   *               jornadaId:
   *                 type: string
   *                 description: The ID of the journey
   *               startDate:
   *                 type: string
   *                 format: date-time
   *                 description: The start date of the journey assignment
   *     responses:
   *       201:
   *         description: Journey assignment created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VinculoJornada'
   *       400:
   *         description: Invalid request body
   *       500:
   *         description: Server error
   */
  async assignJourney(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = assignJourneySchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const { colaboradorId, jornadaId, startDate } = value;
      const vinculo = await this.vinculoJornada.assignJornadaToColaborador(
        colaboradorId,
        jornadaId,
        new Date(startDate)
      );
      res.status(201).json(vinculo);
    } catch (error) {
      console.error('Error ao vincular jornada:', error);
      res.status(500).json({ error: 'Error ao vincular jornada' });
    }
  }

    /**
   * @swagger
   * /api/vincular-jornada/{id}:
   *   get:
   *     summary: Get a vinculo de jornada by ID
   *     tags: [Vincular Jornada]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: vinculo de jornada ID
   *     responses:
   *       200:
   *         description: vinculo de jornadafound
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VinculoJornada'
   *       404:
   *         description: vinculo de jornada not found
   *       500:
   *         description: Server error
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const vinculo = await this.vinculoJornada.getVinculoJornadaById(req.params.id);
      if (!vinculo) {
        res.status(404).json({ error: 'Não foi possível encontrar jornada.' });
        return;
      }
      res.status(200).json(vinculo);
    } catch (error) {
      console.error('Erro ao procurar Jornada por ID:', error);
      res.status(500).json({ error: 'Erro ao procurar Jornada por ID' });
    }
  }

   /**
   * @swagger
   * /api/vincular-jornada:
   *   get:
   *     summary: Get all Vincular Jornada
   *     tags: [Vincular Jornada]
   *     responses:
   *       200:
   *         description: List of Vincular Jornadas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/VinculoJornada'
   *       500:
   *         description: Server error
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const vinculos = await this.vinculoJornada.getAllVinculoJornadas();
      res.status(200).json(vinculos);
    } catch (error) {
      console.error('Erro ao listar todas jornadas:', error);
      res.status(500).json({ error: 'Erro ao listar todas jornadas' });
    }
  }
} 