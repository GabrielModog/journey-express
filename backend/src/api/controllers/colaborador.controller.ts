import { Request, Response } from 'express';
import Joi from 'joi';

import { IColaboradorService } from 'src/core/services/interfaces/colaborador-service.interface';

const colaboradorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Colaborador:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the Colaborador
 *         name:
 *           type: string
 *           description: The name of the Colaborador
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the Colaborador
 *         department:
 *           type: string
 *           description: The department of the Colaborador
 *         position:
 *           type: string
 *           description: The position of the Colaborador
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 */
export class ColaboradorController {
  constructor(private colaboradorService: IColaboradorService) { }

  /**
   * @swagger
   * /api/colaboradores:
   *   post:
   *     summary: Create a new Colaborador
   *     tags: [Colaborador]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the Colaborador
   *               email:
   *                 type: string
   *                 format: email
   *                 description: The email of the Colaborador
   *               department:
   *                 type: string
   *                 description: The department of the Colaborador
   *               position:
   *                 type: string
   *                 description: The position of the Colaborador
   *     responses:
   *       201:
   *         description: Colaborador created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Colaborador'
   *       400:
   *         description: Invalid request body
   *       500:
   *         description: Server error
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = colaboradorSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const colaborador = await this.colaboradorService.createColaborador(value);
      res.status(201).json(colaborador);
    } catch (error) {
      console.error("Erro ao criar colaborador:", error);
      res.status(500).json({ error: "Erro ao criar colaborador" });
    }
  }

  /**
   * @swagger
   * /api/colaboradores/{id}:
   *   get:
   *     summary: Get an Colaborador by ID
   *     tags: [Colaborador]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Colaborador ID
   *     responses:
   *       200:
   *         description: Colaborador found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Colaborador'
   *       404:
   *         description: Colaborador not found
   *       500:
   *         description: Server error
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const colaborador = await this.colaboradorService.getColaboradorById(req.params.id);
      if (!colaborador) {
        res.status(404).json({ error: "Colaborador não encontrado" });
        return;
      }
      res.status(200).json(colaborador);
    } catch (error) {
      console.error("Error ao pegar Colaborador por ID:", error);
      res.status(500).json({ error: "Error ao pegar Colaborador por ID" });
    }
  }

  /**
   * @swagger
   * /api/colaboradores:
   *   get:
   *     summary: Get all Colaboradores
   *     tags: [Colaborador]
   *     responses:
   *       200:
   *         description: List of Colaboradores
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Colaborador'
   *       500:
   *         description: Server error
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const colaboradores = await this.colaboradorService.getAllColaboradores();
      res.status(200).json(colaboradores);
    } catch (error) {
      console.error("Erro ao listar colaboradores:", error);
      res.status(500).json({ error: "Erro ao listar colaboradores" });
    }
  }
} 