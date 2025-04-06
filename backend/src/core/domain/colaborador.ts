import { Schema } from 'mongoose';

export interface Colaborador {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const employeeSchema = new Schema<Colaborador>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, {
  timestamps: true
}); 