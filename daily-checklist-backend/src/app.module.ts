import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChecklistModule } from './checklist/checklist.module';
import { QuestionsModule } from './questions/questions.module';
import { DailyExpanseModule } from './DailyExpanse/dailyexpanse.module';
import { AppointmentModule } from './appointments/appointment.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI'),
      }),
    }),
    AdminModule,
    AppointmentModule,
    DailyExpanseModule,
    AuthModule,
    UsersModule,
    SeedModule,
    QuestionsModule,
    ChecklistModule,
  ],
})
export class AppModule {}
