import { Types } from 'mongoose';
import { Queue } from 'bull';

import { VinculoJornada, VinculoJornadaModel, JornadaStatus } from '../domain/vinculo-jornada';
import { ColaboradorModel } from '../models/colaborador.model';
import { JornadaModel } from '../models/jornada.model';

export class VinculoJornadaService {
  constructor(private readonly actionQueue: Queue | null) {}

  async assignJornadaToColaborador(
    colaboradorId: string,
    jornadaId: string,
    startDate: Date
  ): Promise<VinculoJornada> {
    const colaborador = await ColaboradorModel.findById(colaboradorId);
    if (!colaborador) {
      throw new Error('Colaborador não encontrado.');
    }

    const jornada = await JornadaModel.findById(jornadaId);
    if (!jornada) {
      throw new Error('Jornada não encontrado.');
    }

    const assignment = await VinculoJornadaModel.create({
      colaborador: new Types.ObjectId(colaboradorId),
      jornada: new Types.ObjectId(jornadaId),
      startDate,
      status: JornadaStatus.PENDING,
      currentActionIndex: 0
    });

    await this.scheduleNextAction(assignment);

    return assignment;
  }

  private async scheduleNextAction(assignment: VinculoJornada): Promise<void> {
    const jornada = await JornadaModel.findById(assignment.jornada)
      .populate('actions')
      .exec();

    if (!jornada) {
      throw new Error('Jornada não encontrada.');
    }

    const jornadaAny = jornada as any;
    const currentAction = jornadaAny.actions[assignment.currentActionIndex];
    if (!currentAction) {
      await VinculoJornadaModel.findByIdAndUpdate(assignment.id, {
        status: JornadaStatus.COMPLETED,
        completedAt: new Date()
      });
      return;
    }

    const delay = currentAction.delayMinutes * 60 * 1000; // Convert to milliseconds

    await this.actionQueue.add(
      'execute-action',
      {
        assignmentId: assignment.id,
        actionId: currentAction.id,
        actionType: currentAction.type,
        config: currentAction.config
      },
      {
        delay,
        jobId: `${assignment.id}-${currentAction.id}`
      }
    );

    await VinculoJornadaModel.findByIdAndUpdate(assignment.id, {
      status: JornadaStatus.IN_PROGRESS,
      lastActionExecutedAt: new Date()
    });
  }

  async handleActionCompletion(
    assignmentId: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    const assignment = await VinculoJornadaModel.findById(assignmentId);
    if (!assignment) {
      throw new Error('Vinculo de jornada não encontrada.');
    }

    if (!success) {
      await VinculoJornadaModel.findByIdAndUpdate(assignmentId, {
        status: JornadaStatus.FAILED,
        errorMessage
      });
      return;
    }

    assignment.currentActionIndex += 1;
    await assignment.save();

    await this.scheduleNextAction(assignment);
  }

  async getVinculoJornadaById(id: string): Promise<VinculoJornada | null> {
    return VinculoJornadaModel.findById(id);
  }

  async getAllVinculoJornadas(): Promise<VinculoJornada[]> {
    return VinculoJornadaModel.find();
  }

  async updateVinculoJornada(id: string, update: Partial<VinculoJornada>): Promise<VinculoJornada | null> {
    return VinculoJornadaModel.findByIdAndUpdate(id, update, { new: true });
  }

  async addActionToQueue(assignmentId: string, actionId: string, actionType: string, config: any): Promise<void> {
    if (!this.actionQueue) {
      throw new Error('Queue is not initialized');
    }

    await this.actionQueue.add('execute-action', {
      assignmentId,
      actionId,
      actionType,
      config
    });
  }
} 