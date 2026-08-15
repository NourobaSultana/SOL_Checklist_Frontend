import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateDailyExpanseDto } from './dto/create.dailyexpanse.dto';

import {
  DailyExpanse,
  DailyExpanseDocument,
} from './schema/dailyexpanse.schema';

@Injectable()
export class DailyExpanseService {
  constructor(
    @InjectModel(DailyExpanse.name)
    private readonly dailyexpanseModel: Model<DailyExpanseDocument>,
  ) {}

  // ============================
  // Create Daily Expense
  // ============================
  async create(createdailyexpanseDto: CreateDailyExpanseDto, user: any) {
    console.log('DTO:', createdailyexpanseDto);
    console.log('USER:', user);

    const dailyExpanse = await this.dailyexpanseModel.create({
      user: new Types.ObjectId(user.userId),

      DailyExpanse: createdailyexpanseDto.DailyExpanse ?? '',
    });

    console.log('SAVED:', dailyExpanse);

    return dailyExpanse;
  }

  // ============================
  // User Daily Expense History
  // ============================
  async getMyHistory(userId: string) {
    return this.dailyexpanseModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .sort({
        createdAt: -1,
      });
  }

  async getAllHistory() {
  return this.dailyexpanseModel
    .find()
    .populate('user', 'name email role')
    .sort({
      createdAt: -1,
    });
}
}
