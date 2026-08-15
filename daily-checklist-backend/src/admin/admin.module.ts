import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointments/schema/appointment.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import {
  DailyExpanse,
  DailyExpanseSchema,
} from 'src/DailyExpanse/schema/dailyexpanse.schema';
import {
  Checklist,
  ChecklistSchema,
} from 'src/checklist/schema/checklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Checklist.name,
        schema: ChecklistSchema,
      },
      {
        name: Appointment.name,
        schema: AppointmentSchema,
      },
      {
        name: DailyExpanse.name,
        schema: DailyExpanseSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],

  controllers: [AdminController],

  providers: [AdminService],
})
export class AdminModule {}
