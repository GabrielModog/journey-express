import { Schema } from "mongoose";

export enum ActionType {
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
  API_CALL = "API_CALL"
}

export interface Action {
  _id: string;
  type: string;
  config: any;
  order: number;
  delayMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export const actionSchema = new Schema<Action>({
  type: { 
    type: String, 
    enum: Object.values(ActionType),
    required: true 
  },
  config: {
    type: Schema.Types.Mixed,
    required: true
  },
  order: { type: Number, required: true },
  delayMinutes: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
}); 