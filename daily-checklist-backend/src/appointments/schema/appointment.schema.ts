import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({
  timestamps: true,
})
export class Appointment {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: String,
    default: '',
    trim: true,
  })
  appointment: string;
}

export const AppointmentSchema =
  SchemaFactory.createForClass(Appointment);