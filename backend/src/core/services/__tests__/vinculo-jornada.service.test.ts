import { Queue } from 'bull';
import { Types } from 'mongoose';

import { VinculoJornadaService } from '../vinculo-jornada.service';
import { VinculoJornadaModel } from '../../../core/domain/vinculo-jornada';
import { JornadaModel } from '../../../core/models/jornada.model';
import { ColaboradorModel } from '../../../core/models/colaborador.model';
import { JornadaStatus } from '../../../core/domain/vinculo-jornada';

jest.mock('../../../core/models/jornada.model');
jest.mock('../../../core/models/colaborador.model');
jest.mock('../../../core/domain/vinculo-jornada');

describe('VinculoJornadaService', () => {
  let service: VinculoJornadaService;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(() => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({}),
    } as any;

    service = new VinculoJornadaService(mockQueue);

    jest.clearAllMocks();
  });

  describe('assignJourneyToEmployee', () => {
    it('should create a journey assignment and schedule the first action', async () => {
      const coloboradorId = new Types.ObjectId().toString();
      const jornadaId = new Types.ObjectId().toString();
      const actionId = new Types.ObjectId().toString();
      const startDate = new Date();

      const mockEmployee = {
        id: coloboradorId,
        name: 'John Doe',
        email: 'john@example.com'
      };

      const mockJourney = {
        id: jornadaId,
        name: 'Onboarding',
        actions: [
          {
            id: actionId,
            type: 'EMAIL',
            order: 1,
            delayMinutes: 0
          }
        ]
      };

      const mockAssignment = {
        id: new Types.ObjectId().toString(),
        employee: coloboradorId,
        journey: jornadaId,
        startDate,
        status: JornadaStatus.PENDING,
        currentActionIndex: 0,
        save: jest.fn().mockResolvedValue(true)
      };

      // Configurar os mocks
      jest.spyOn(ColaboradorModel, 'findById').mockResolvedValue(mockEmployee as any);
      jest.spyOn(JornadaModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockJourney)
      } as any);
      jest.spyOn(VinculoJornadaModel, 'create').mockResolvedValue(mockAssignment as any);
      jest.spyOn(VinculoJornadaModel, 'findByIdAndUpdate').mockResolvedValue(mockAssignment as any);

      // Act
      const result = await service.assignJornadaToColaborador(
        coloboradorId,
        jornadaId,
        startDate
      );

      // Assert
      expect(result).toBeDefined();
      expect(mockQueue.add).toHaveBeenCalledWith(
        'execute-action',
        expect.objectContaining({
          actionId,
          assignmentId: mockAssignment.id,
          actionType: 'EMAIL',
        }),
        expect.any(Object)
      );
    });

    it('should throw error when employee not found', async () => {
      const coloboradorId = new Types.ObjectId().toString();
      const jornadaId = new Types.ObjectId().toString();
      
      jest.spyOn(ColaboradorModel, 'findById').mockResolvedValue(null);

      await expect(
        service.assignJornadaToColaborador(coloboradorId, jornadaId, new Date())
      ).rejects.toThrow('Colaborador não encontrado.');
    });

    it('should throw error when jornada not found', async () => {
      const coloboradorId = new Types.ObjectId().toString();
      const jornadaId = new Types.ObjectId().toString();
      const mockEmployee = {
        id: coloboradorId,
        name: 'John Doe',
        email: 'john@example.com'
      };

      jest.spyOn(ColaboradorModel, 'findById').mockResolvedValue(mockEmployee as any);
      jest.spyOn(JornadaModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      } as any);

      await expect(
        service.assignJornadaToColaborador(coloboradorId, jornadaId, new Date())
      ).rejects.toThrow('Jornada não encontrada');
    });
  });

  describe('handleActionCompletion', () => {
    it('should update assignment status and schedule next action on success', async () => {
      const assignmentId = new Types.ObjectId().toString();
      const actionId = new Types.ObjectId().toString();
      const nextActionId = new Types.ObjectId().toString();

      const mockAssignment = {
        id: assignmentId,
        employee: new Types.ObjectId().toString(),
        journey: new Types.ObjectId().toString(),
        startDate: new Date(),
        status: JornadaStatus.IN_PROGRESS,
        currentActionIndex: 0,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockJourney = {
        id: new Types.ObjectId().toString(),
        name: 'Onboarding',
        actions: [
          {
            id: actionId,
            type: 'EMAIL',
            order: 1,
            delayMinutes: 0
          },
          {
            id: nextActionId,
            type: 'WHATSAPP',
            order: 2,
            delayMinutes: 60
          }
        ]
      };

      jest.spyOn(VinculoJornadaModel, 'findById').mockResolvedValue(mockAssignment as any);
      jest.spyOn(JornadaModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockJourney)
      } as any);
      jest.spyOn(VinculoJornadaModel, 'findByIdAndUpdate').mockResolvedValue(mockAssignment as any);

      await service.handleActionCompletion(assignmentId, true);

      expect(mockAssignment.currentActionIndex).toBe(1);
      expect(mockQueue.add).toHaveBeenCalledWith(
        'execute-action',
        expect.objectContaining({
          actionId: nextActionId,
          assignmentId,
          actionType: 'WHATSAPP',
        }),
        expect.any(Object)
      );
    });

    it('should mark journey as completed when all actions are done', async () => {
      const assignmentId = new Types.ObjectId().toString();
      const actionId = new Types.ObjectId().toString();

      const mockAssignment = {
        id: assignmentId,
        employee: new Types.ObjectId().toString(),
        journey: new Types.ObjectId().toString(),
        startDate: new Date(),
        status: JornadaStatus.IN_PROGRESS,
        currentActionIndex: 0,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockJourney = {
        id: new Types.ObjectId().toString(),
        name: 'Onboarding',
        actions: [
          {
            id: actionId,
            type: 'EMAIL',
            order: 1,
            delayMinutes: 0
          }
        ]
      };

      jest.spyOn(VinculoJornadaModel, 'findById').mockResolvedValue(mockAssignment as any);
      jest.spyOn(JornadaModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockJourney)
      } as any);
      jest.spyOn(VinculoJornadaModel, 'findByIdAndUpdate').mockResolvedValue(mockAssignment as any);

      await service.handleActionCompletion(assignmentId, true);

      expect(VinculoJornadaModel.findByIdAndUpdate).toHaveBeenCalledWith(
        assignmentId,
        expect.objectContaining({
          status: JornadaStatus.COMPLETED
        })
      );
      expect(mockQueue.add).not.toHaveBeenCalled();
    });

    it('should mark journey as failed when action fails', async () => {
      const assignmentId = new Types.ObjectId().toString();
      const errorMessage = 'Failed to send email';

      const mockAssignment = {
        id: assignmentId,
        employee: new Types.ObjectId().toString(),
        journey: new Types.ObjectId().toString(),
        startDate: new Date(),
        status: JornadaStatus.IN_PROGRESS,
        currentActionIndex: 0,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(VinculoJornadaModel, 'findById').mockResolvedValue(mockAssignment as any);
      jest.spyOn(VinculoJornadaModel, 'findByIdAndUpdate').mockResolvedValue(mockAssignment as any);

      await service.handleActionCompletion(assignmentId, false, errorMessage);

      expect(VinculoJornadaModel.findByIdAndUpdate).toHaveBeenCalledWith(
        assignmentId,
        expect.objectContaining({
          status: JornadaStatus.FAILED,
          errorMessage
        })
      );
      expect(mockQueue.add).not.toHaveBeenCalled();
    });
  });
}); 