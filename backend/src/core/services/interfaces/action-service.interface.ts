import { Action } from '../../domain/action';

export interface IActionService {
  createAction(data: { type: string, order: number, delayMinutes: number }): Promise<Action>;
  getActionById(id: string): Promise<Action | null>;
  getAllActions(): Promise<Action[]>;
} 