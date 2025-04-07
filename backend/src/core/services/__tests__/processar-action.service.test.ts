import { ProcessarActionService } from '../processar-action.service';
import { VinculoJornadaService } from '../vinculo-jornada.service';
import { ActionType } from '../../domain/action';

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

jest.mock('../vinculo-jornada.service');

describe('ProcessarActionService', () => {
  let service: ProcessarActionService;
  let mockVinculoJornadaService: jest.Mocked<VinculoJornadaService>;

  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    mockVinculoJornadaService = {
      handleActionCompletion: jest.fn().mockResolvedValue(undefined),
    } as any;

    service = new ProcessarActionService(mockVinculoJornadaService);
    
    jest.spyOn(service as any, 'sendEmail').mockResolvedValue(undefined);
    jest.spyOn(service as any, 'sendWhatsAppMessage').mockResolvedValue(undefined);
    jest.spyOn(service as any, 'makeApiCall').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processAction', () => {
    it('should process email action successfully', async () => {
      const assignmentId = 'assignment-123';
      const actionId = 'action-123';
      await service.processAction(
        assignmentId,
        actionId,
        ActionType.EMAIL,
      );

      expect(mockVinculoJornadaService.handleActionCompletion).toHaveBeenCalledWith(
        assignmentId,
        true
      );
    });

    it('should process WhatsApp action successfully', async () => {
      const assignmentId = 'assignment-123';
      const actionId = 'action-123';

      await service.processAction(
        assignmentId,
        actionId,
        ActionType.WHATSAPP,
      );

      expect(mockVinculoJornadaService.handleActionCompletion).toHaveBeenCalledWith(
        assignmentId,
        true
      );
    });

    it('should process API call action successfully', async () => {
      const assignmentId = 'assignment-123';
      const actionId = 'action-123';

      await service.processAction(
        assignmentId,
        actionId,
        ActionType.API_CALL,
      );

      expect(mockVinculoJornadaService.handleActionCompletion).toHaveBeenCalledWith(
        assignmentId,
        true
      );
    });

    it('should handle errors and notify journey assignment service', async () => {
      const assignmentId = 'assignment-123';
      const actionId = 'action-123';
      
      const error = new Error('API call failed');
      (service['makeApiCall'] as jest.Mock).mockRejectedValue(error);

      await expect(
        service.processAction(
          assignmentId,
          actionId,
          ActionType.API_CALL,
        )
      ).rejects.toThrow('API call failed');

      expect(mockVinculoJornadaService.handleActionCompletion).toHaveBeenCalledWith(
        assignmentId,
        false,
        'API call failed'
      );
    });

    it('should throw error for unsupported action type', async () => {
      const assignmentId = 'assignment-123';
      const actionId = 'action-123';

      await expect(
        service.processAction(
          assignmentId,
          actionId,
          'UNSUPPORTED' as ActionType,
        )
      ).rejects.toThrow('Unsupported action type: UNSUPPORTED');
    });
  });
}); 