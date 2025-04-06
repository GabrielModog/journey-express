import { ActionType } from '../domain/action';
import { VinculoJornadaService } from './vinculo-jornada.service';
import { logActionExecution } from '../utils/logger';

export class ProcessarActionService {
  constructor(
    private readonly vinculoJornadaService: VinculoJornadaService
  ) {}

  async processAction(
    assignmentId: string,
    actionId: string,
    actionType: ActionType,
    config: any
  ): Promise<void> {
    try {
      logActionExecution(actionId, assignmentId, 'started');
      
      switch (actionType) {
        case ActionType.EMAIL:
          await this.sendEmail(config);
          break;
        case ActionType.WHATSAPP:
          await this.sendWhatsAppMessage(config);
          break;
        case ActionType.API_CALL:
          await this.makeApiCall(config);
          break;
        default:
          throw new Error(`Unsupported action type: ${actionType}`);
      }

      await this.vinculoJornadaService.handleActionCompletion(
        assignmentId,
        true
      );
      
      // Registrar conclusão bem-sucedida da ação
      logActionExecution(actionId, assignmentId, 'completed');
    } catch (error) {
      await this.vinculoJornadaService.handleActionCompletion(
        assignmentId,
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      logActionExecution(actionId, assignmentId, 'failed', error instanceof Error ? error : new Error('Unknown error'));
      
      throw error;
    }
  }

  private async sendEmail(config: any): Promise<void> {
    console.log('Sending email:', {
      to: config.to,
      subject: config.subject,
      content: config.content
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async sendWhatsAppMessage(config: any): Promise<void> {
    console.log('Sending WhatsApp message:', {
      to: config.to,
      content: config.content
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async makeApiCall(config: any): Promise<void> {
    console.log('Making API call:', {
      url: config.apiUrl,
      method: config.method,
      headers: config.headers,
      body: config.requestBody
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
} 