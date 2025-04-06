import { Schema, model, Types } from 'mongoose';

export enum JornadaStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface VinculoJornada {
  id: string;
  employee: Types.ObjectId;
  journey: Types.ObjectId;
  startDate: Date;
  status: JornadaStatus;
  currentActionIndex: number;
  lastActionExecutedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const vinculoJornadaSchema = new Schema<VinculoJornada>({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  journey: { type: Schema.Types.ObjectId, ref: 'Journey', required: true },
  startDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: Object.values(JornadaStatus),
    default: JornadaStatus.PENDING 
  },
  currentActionIndex: { type: Number, default: 0 },
  lastActionExecutedAt: { type: Date },
  completedAt: { type: Date },
  errorMessage: { type: String }
}, {
  timestamps: true
});

export const VinculoJornadaModel = model<VinculoJornada>('JourneyAssignment', vinculoJornadaSchema); 