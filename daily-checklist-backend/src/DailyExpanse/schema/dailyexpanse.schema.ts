import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type DailyExpanseDocument = HydratedDocument<DailyExpanse>;

@Schema({
  timestamps: true,
})
export class DailyExpanse {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: String,
    default: '',
  })
  DailyExpanse: string;
}

export const DailyExpanseSchema = SchemaFactory.createForClass(DailyExpanse);
