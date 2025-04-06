export enum ActionType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  VINCULACAO = 'VINCULACAO',
  DESVINCULACAO = 'DESVINCULACAO',
}

export interface Action {
  _id: string;
  type: ActionType;
  config: Record<string, unknown>;
  order: number;
  delay: number;
  createdAt: string;
  updatedAt: string;
}

export interface Jornada {
  _id: string;
  name: string;
  isActive: boolean;
  actions: Action[];
  createdAt: string;
  updatedAt: string;
}

export interface Colaborador {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VinculoJornada {
  _id: string;
  jornadaId: string;
  colaboradorId: string;
  startDate: string;
  status: string
  jornada: Jornada;
  colaborador: Colaborador;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
} 