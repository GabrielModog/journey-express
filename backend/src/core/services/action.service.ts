import { Action } from '../domain/action';
import { ActionModel } from '../models/action.model';
import { IActionService } from './interfaces/action-service.interface';

export class ActionService implements IActionService {
  async createAction(data: { type: string, config: any, order: number, delayMinutes: number }): Promise<Action> {
    try {
      const action = await ActionModel.create(data);
      return action;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async getActionById(id: string): Promise<Action | null> {
    try {
      const action = await ActionModel.findById(id);
      return action;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }

  async getAllActions(): Promise<Action[]> {
    try {
      const actions = await ActionModel.find();
      return actions;
    } catch (error) {
      // TODO: adicionar logger
      throw error;
    }
  }
} 