import { Request, Response } from 'express';
import Joi from 'joi';
import { IJornadaService } from 'src/core/services/interfaces/jornada-service.interface';

const jornadaSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  actions: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one action is required',
    'array.base': 'Actions must be an array'
  }),
  isActive: Joi.boolean().default(true)
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Jornada:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - actions
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the Jornada
 *         name:
 *           type: string
 *           description: The name of the Jornada
 *         description:
 *           type: string
 *           description: The description of the Jornada
 *         actions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of action IDs that make up the Jornada
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 */
export class JornadaController {
  constructor(private jornadaService: IJornadaService) { }

  /**
   * @swagger
   * /api/jornadas:
   *   post:
   *     summary: Create a new Jornada
   *     tags: [Jornada]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - description
   *               - actions
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the Jornada
   *               description:
   *                 type: string
   *                 description: The description of the Jornada
   *               actions:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of action IDs that make up the Jornada
   *     responses:
   *       201:
   *         description: Jornada created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Jornada'
   *       400:
   *         description: Invalid request body
   *       500:
   *         description: Server error
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = jornadaSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const jornada = await this.jornadaService.createJornada(value);
      res.status(201).json(jornada);
    } catch (error) {
      console.error('Erro ao criar jornada', error);
      res.status(500).json({ error: 'Erro ao criar jornada' });
    }
  }

  /**
   * @swagger
   * /api/jornadas/{id}:
   *   get:
   *     summary: Get a Jornada by ID
   *     tags: [Jornada]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Jornada ID
   *     responses:
   *       200:
   *         description: Jornada found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Jornada'
   *       404:
   *         description: Jornada not found
   *       500:
   *         description: Server error
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const jornada = await this.jornadaService.getJornadaById(req.params.id);
      if (!jornada) {
        res.status(404).json({ error: 'Jornada não encontrada' });
        return;
      }
      res.status(200).json(jornada);
    } catch (error) {
      console.error('Error ao pegar Jornada por ID', error);
      res.status(500).json({ error: 'Error ao pegar Jornada por ID' });
    }
  }

  /**
   * @swagger
   * /api/jornadas:
   *   get:
   *     summary: Get all Jornadas
   *     tags: [Jornada]
   *     responses:
   *       200:
   *         description: List of Jornadas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Jornada'
   *       500:
   *         description: Server error
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const jornadas = await this.jornadaService.getAllJornadas();
      res.status(200).json(jornadas);
    } catch (error) {
      console.error('Erro ao listar jornadas:', error);
      res.status(500).json({ error: 'Erro ao listar jornadas' });
    }
  }
} 