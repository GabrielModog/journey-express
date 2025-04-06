import mongoose, { Document } from 'mongoose';
import { Colaborador, colaboradorSchema } from '../domain/colaborador';

export const ColaboradorModel = mongoose.model<Colaborador & Document>('Colaborador', colaboradorSchema as any); 