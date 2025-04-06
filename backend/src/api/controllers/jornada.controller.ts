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

export class JornadaController {
  constructor(private jornadaService: IJornadaService) {}

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