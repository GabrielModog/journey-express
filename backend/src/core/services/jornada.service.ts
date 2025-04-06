import { Jornada } from '../domain/jornada';
import { JornadaModel } from '../models/jornada.model';
import { IJornadaService } from './interfaces/jornada-service.interface';

export class JornadaService implements IJornadaService {
  async createJornada(data: { name: string, description: string, actions: string[] }): Promise<Jornada> {
    try {
      const jornada = await JornadaModel.create(data);
      return jornada;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async getJornadaById(id: string): Promise<Jornada | null> {
    try {
      const jornada = await JornadaModel.findById(id).populate('actions');
      return jornada;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async getAllJornadas(): Promise<Jornada[]> {
    try {
      const jornadas = await JornadaModel.find().populate('actions');
      return jornadas;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async updateJornada(id: string, data: Partial<Jornada>): Promise<Jornada | null> {
    try {
      const jornada = await JornadaModel.findByIdAndUpdate(id, data, { new: true }).populate('actions');
      return jornada;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async deleteJornada(id: string): Promise<boolean> {
    try {
      const result = await JornadaModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }
} 