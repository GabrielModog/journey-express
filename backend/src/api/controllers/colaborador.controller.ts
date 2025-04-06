import { Request, Response } from 'express';
import Joi from 'joi';

import { IColaboradorService } from 'src/core/services/interfaces/colaborador-service.interface';

const colaboradorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional()
});

export class ColaboradorController {
  constructor(private colaboradorService: IColaboradorService) {}

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