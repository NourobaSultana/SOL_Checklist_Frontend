import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Appointment, AppointmentDocument } from './schema/appointment.schema';

import { CreateAppointmentDto } from './dto/create.appoinment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  // ============================
  // Create Appointment
  // ============================
  async create(createappointmentDto: CreateAppointmentDto, user: any) {
    const appointment = await this.appointmentModel.create({
      user: new Types.ObjectId(user.userId),
      appointment: createappointmentDto.appointment ?? '',
    });

    return appointment;
  }

  // ============================
  // User Appointment History
  // ============================
  async getMyHistory(userId: string) {
    return this.appointmentModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .sort({
        createdAt: -1,
      });
  }


  async getAllHistory() {
  return this.appointmentModel
    .find()
    .populate('user', 'name email role')
    .sort({
      createdAt: -1,
    });
}
}
