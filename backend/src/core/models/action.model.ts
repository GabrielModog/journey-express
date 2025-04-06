import mongoose, { Document } from 'mongoose';
import { Action, actionSchema } from '../domain/action';

export const ActionModel = mongoose.model<Action & Document>('Action', actionSchema as any); 