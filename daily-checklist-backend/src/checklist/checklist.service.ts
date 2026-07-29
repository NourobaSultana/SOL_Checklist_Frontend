import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Checklist, ChecklistDocument } from './schema/checklist.schema';

import { CreateChecklistDto } from './dto/create-checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectModel(Checklist.name)
    private readonly checklistModel: Model<ChecklistDocument>,
  ) {}

  // ==========================================
  // Submit Daily Checklist
  // ==========================================
  async create(
    userId: string,
    createChecklistDto: CreateChecklistDto,
  ) {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const alreadySubmitted = await this.checklistModel.findOne({
      user: new Types.ObjectId(userId),
      checklistDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (alreadySubmitted) {
      throw new BadRequestException(
        'You already submitted today checklist.',
      );
    }

    const checklist = await this.checklistModel.create({
      user: new Types.ObjectId(userId),

      checklistDate: today,

      answers: createChecklistDto.answers,

      appointment: createChecklistDto.appointment ?? '',

      DailyExpanse: createChecklistDto.DailyExpanse ?? '',
    });

    return {
      message: 'Checklist submitted successfully.',
      checklist,
    };
  }

  async findById(id: string) {
  return this.checklistModel.findById(id);
  }

  // ==========================================
  // Logged In User History
  // ==========================================
  async getMyHistory(userId: string) {
    return this.checklistModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .sort({
        checklistDate: -1,
      });
  }


  async findAllHistory() {
  return this.checklistModel
    .find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
}

  // ==========================================
  // Logged In User Single Date
  // ==========================================
  async getByDate(
    userId: string,
    date: string,
  ) {
    const selectedDate = new Date(date);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const checklist = await this.checklistModel.findOne({
      user: new Types.ObjectId(userId),

      checklistDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!checklist) {
      throw new NotFoundException(
        'Checklist not found.',
      );
    }

    return checklist;
  }

  // ==========================================
  // Admin
  // All Checklist
  // ==========================================
  async getAllHistory() {
    return this.checklistModel
      .find()
      .populate('user', 'name email role')
      .sort({
        checklistDate: -1,
      });
  }

  // ==========================================
  // Admin
  // User History
  // ==========================================
  async getUserHistory(userId: string) {
    return this.checklistModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .populate('user', 'name email role')
      .sort({
        checklistDate: -1,
      });
  }
}