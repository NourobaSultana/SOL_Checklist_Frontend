import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UsersModule } from '../users/users.module';

import { Appointment, AppointmentSchema } from './schema/appointment.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Appointment.name,
        schema: AppointmentSchema,
      },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
