import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
  timestamps: true,
})
export class Question {
  @Prop({
    required: true,
    trim: true,
  })
  question: string;
}

export const QuestionSchema =
  SchemaFactory.createForClass(Question);