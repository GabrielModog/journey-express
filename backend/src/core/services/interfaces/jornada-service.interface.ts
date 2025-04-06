import { Jornada } from '../../domain/jornada';

export interface IJornadaService {
  createJornada(data: { name: string, description: string, actions: string[] }): Promise<Jornada>;
  getJornadaById(id: string): Promise<Jornada | null>;
  getAllJornadas(): Promise<Jornada[]>;
  updateJornada(id: string, data: Partial<Jornada>): Promise<Jornada | null>;
  deleteJornada(id: string): Promise<boolean>;
} 