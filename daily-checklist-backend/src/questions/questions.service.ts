import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Question,
  QuestionDocument,
} from './schemas/question.schema';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  // ============================
  // Create Question
  // ============================
  async create(
    createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionModel.create(createQuestionDto);
  }

  // ============================
  // Get All Questions
  // ============================
  async findAll() {
    return this.questionModel.find().sort({
      createdAt: 1,
    });
  }

  // ============================
  // Get One Question
  // ============================
  async findOne(id: string) {
    const question =
      await this.questionModel.findById(id);

    if (!question) {
      throw new NotFoundException(
        'Question not found',
      );
    }

    return question;
  }

  // ============================
  // Update Question
  // ============================
  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    const question =
      await this.questionModel.findByIdAndUpdate(
        id,
        updateQuestionDto,
        {
          new: true,
        },
      );

    if (!question) {
      throw new NotFoundException(
        'Question not found',
      );
    }

    return question;
  }

  // ============================
  // Delete Question
  // ============================
  async remove(id: string) {
    const question =
      await this.questionModel.findByIdAndDelete(
        id,
      );

    if (!question) {
      throw new NotFoundException(
        'Question not found',
      );
    }

    return {
      message:
        'Question deleted successfully',
    };
  }
}