import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import {
  Checklist,
  ChecklistDocument,
} from '../checklist/schema/checklist.schema';

import {
  Appointment,
  AppointmentDocument,
} from '../appointments/schema/appointment.schema';

import {
  DailyExpanse,
  DailyExpanseDocument,
} from '../DailyExpanse/schema/dailyexpanse.schema';

import { User, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Checklist.name)
    private readonly checklistModel: Model<ChecklistDocument>,

    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,

    @InjectModel(DailyExpanse.name)
    private readonly expenseModel: Model<DailyExpanseDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // ==========================================
  // GET ALL HISTORY
  // ==========================================
  async getHistory(options: {
    type?: string;
    userId?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
    page: number;
    limit: number;
  }) {
    const { type, userId, search, fromDate, toDate, page, limit } = options;

    const currentPage = Math.max(page || 1, 1);

    const currentLimit = Math.max(limit || 10, 1);

    // ==========================================
    // USER FILTER
    // ==========================================

    let userIds: Types.ObjectId[] | undefined;

    if (search) {
      const users = await this.userModel
        .find({
          $or: [
            {
              name: {
                $regex: search,
                $options: 'i',
              },
            },
            {
              email: {
                $regex: search,
                $options: 'i',
              },
            },
          ],
        })
        .select('_id');

      userIds = users.map((user) => user._id);
    }

    if (userId) {
      userIds = [new Types.ObjectId(userId)];
    }

    // ==========================================
    // DATE FILTER
    // ==========================================

    const dateFilter: any = {};

    if (fromDate) {
      const start = new Date(fromDate);

      start.setHours(0, 0, 0, 0);

      dateFilter.$gte = start;
    }

    if (toDate) {
      const end = new Date(toDate);

      end.setHours(23, 59, 59, 999);

      dateFilter.$lte = end;
    }

    // ==========================================
    // USER QUERY
    // ==========================================

    const userQuery: any = {};

    if (userIds) {
      userQuery.user = {
        $in: userIds,
      };
    }

    // ==========================================
    // FETCH DATA
    // ==========================================

    const results: any[] = [];

    // ------------------------------------------
    // CHECKLIST
    // ------------------------------------------

    if (!type || type === 'checklist') {
      const checklists = await this.checklistModel
        .find({
          ...userQuery,
          ...(Object.keys(dateFilter).length
            ? {
                checklistDate: dateFilter,
              }
            : {}),
        })
        .populate('user', 'name email role')
        .sort({
          checklistDate: -1,
        });

      results.push(
        ...checklists.map((item: any) => ({
          _id: item._id,
          type: 'checklist',

          user: item.user,

          date: item.checklistDate || item.createdAt,

          content: {
            answers: item.answers,
          },
        })),
      );
    }

    // ------------------------------------------
    // APPOINTMENT
    // ------------------------------------------

    if (!type || type === 'appointment') {
      const appointments = await this.appointmentModel
        .find({
          ...userQuery,
          ...(Object.keys(dateFilter).length
            ? {
                createdAt: dateFilter,
              }
            : {}),
        })
        .populate('user', 'name email role')
        .sort({
          createdAt: -1,
        });

      results.push(
        ...appointments.map((item: any) => ({
          _id: item._id,
          type: 'appointment',

          user: item.user,

          date: item.createdAt,

          content: {
            appointment: item.appointment,
          },
        })),
      );
    }

    // ------------------------------------------
    // DAILY EXPENSE
    // ------------------------------------------

    if (!type || type === 'expense') {
      const expenses = await this.expenseModel
        .find({
          ...userQuery,
          ...(Object.keys(dateFilter).length
            ? {
                createdAt: dateFilter,
              }
            : {}),
        })
        .populate('user', 'name email role')
        .sort({
          createdAt: -1,
        });

      results.push(
        ...expenses.map((item: any) => ({
          _id: item._id,
          type: 'expense',

          user: item.user,

          date: item.createdAt,

          content: {
            DailyExpanse: item.DailyExpanse,
          },
        })),
      );
    }

    // ==========================================
    // SORT ALL TOGETHER
    // ==========================================

    results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // ==========================================
    // PAGINATION
    // ==========================================

    const total = results.length;

    const totalPages = Math.ceil(total / currentLimit);

    const start = (currentPage - 1) * currentLimit;

    const end = start + currentLimit;

    const paginatedResults = results.slice(start, end);

    return {
      data: paginatedResults,

      total,

      page: currentPage,

      limit: currentLimit,

      totalPages,
    };
  }

  // ==========================================
  // DELETE HISTORY
  // ==========================================

  async deleteHistory(type: string, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid history ID.');
    }

    let result;

    if (type === 'checklist') {
      result = await this.checklistModel.findByIdAndDelete(id);
    } else if (type === 'appointment') {
      result = await this.appointmentModel.findByIdAndDelete(id);
    } else if (type === 'expense') {
      result = await this.expenseModel.findByIdAndDelete(id);
    } else {
      throw new BadRequestException('Invalid history type.');
    }

    if (!result) {
      throw new NotFoundException('History not found.');
    }

    return {
      message: 'History deleted successfully.',
    };
  }

  async getUsers() {
    return this.userModel.find().select('_id name email').sort({
      name: 1,
    });
  }
}
