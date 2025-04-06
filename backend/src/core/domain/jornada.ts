import { Schema, Types } from "mongoose"
import { Action } from "./action"

export interface Jornada {
  id: string
  name: string
  actions: Types.DocumentArray<Action>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const jornadaSchema = new Schema<Jornada>({
  name: { type: String, required: true },
  actions: [{ type: Schema.Types.ObjectId, ref: 'Action' }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
})