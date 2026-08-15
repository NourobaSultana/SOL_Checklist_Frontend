import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type ChecklistDocument = HydratedDocument<Checklist>;

@Schema({ _id: false })
export class ChecklistAnswer {
  @Prop({
    required: true,
    trim: true,
  })
  question: string;

  @Prop({
    required: true,
    enum: ['Yes', 'No'],
  })
  answer: string;
}

const ChecklistAnswerSchema = SchemaFactory.createForClass(ChecklistAnswer);

@Schema({
  timestamps: true,
})
export class Checklist {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
  })
  checklistDate: Date;

  @Prop({
    type: [ChecklistAnswerSchema],
    required: true,
  })
  answers: ChecklistAnswer[];

}

export const ChecklistSchema = SchemaFactory.createForClass(Checklist);
