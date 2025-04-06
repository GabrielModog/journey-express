import { Schema } from 'mongoose';

export interface Colaborador {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const colaboradorSchema = new Schema<Colaborador>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
}, {
  timestamps: true
}); 