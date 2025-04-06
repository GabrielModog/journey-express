import { Colaborador } from '../../domain/colaborador';

export interface IColaboradorService {
  createColaborador(data: { name: string, email: string, department: string, position: string }): Promise<Colaborador>;
  getColaboradorById(id: string): Promise<Colaborador | null>;
  getAllColaboradors(): Promise<Colaborador[]>;
  updateColaborador(id: string, data: Partial<Colaborador>): Promise<Colaborador | null>;
  deleteColaborador(id: string): Promise<boolean>;
} 