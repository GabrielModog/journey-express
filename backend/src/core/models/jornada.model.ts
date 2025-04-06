import mongoose, { Document } from 'mongoose';
import { Jornada, jornadaSchema } from '../domain/jornada';

export const JornadaModel = mongoose.model<Jornada & Document>('Jornada', jornadaSchema as any); 