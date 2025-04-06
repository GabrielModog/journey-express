import { Colaborador } from '../domain/colaborador';
import { ColaboradorModel } from '../models/colaborador.model';
import { IColaboradorService } from './interfaces/colaborador-service.interface';

export class ColaboradorService implements IColaboradorService {
  async createColaborador(data: { name: string, email: string, department: string, position: string }): Promise<Colaborador> {
    try {
      const colaborador = await ColaboradorModel.create(data);
      return colaborador;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async getColaboradorById(id: string): Promise<Colaborador | null> {
    try {
      const colaborador = await ColaboradorModel.findById(id);
      return colaborador;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async getAllColaboradores(): Promise<Colaborador[]> {
    try {
      const colaboradores = await ColaboradorModel.find();
      return colaboradores;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async updateColaborador(id: string, data: Partial<Colaborador>): Promise<Colaborador | null> {
    try {
      const colaborador = await ColaboradorModel.findByIdAndUpdate(id, data, { new: true });
      return colaborador;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async deleteColaborador(id: string): Promise<boolean> {
    try {
      const result = await ColaboradorModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }
} 