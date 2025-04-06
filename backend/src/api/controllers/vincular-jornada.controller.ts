import { Request, Response } from 'express';
import Joi from 'joi';
import { Queue } from 'bull';

import { VinculoJornadaService } from '../../core/services/vinculo-jornada.service';

const assignJourneySchema = Joi.object({
  colaboradorId: Joi.string().required(),
  jornadaId: Joi.string().required(),
  startDate: Joi.date().iso().required()
});

export class VinculoJornadaController {
  private vinculoJornada: VinculoJornadaService;

  constructor(queue: Queue) {
    this.vinculoJornada = new VinculoJornadaService(queue)
  }

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