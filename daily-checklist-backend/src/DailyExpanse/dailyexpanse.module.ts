import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DailyExpanseController } from './dailyexpanse.controller';
import { DailyExpanseService } from './dailyexpanse.service';
import { UsersModule } from '../users/users.module';

import { DailyExpanse, DailyExpanseSchema } from './schema/dailyexpanse.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: DailyExpanse.name,
        schema: DailyExpanseSchema,
      },
    ]),
  ],
  controllers: [DailyExpanseController],
  providers: [DailyExpanseService],
  exports: [DailyExpanseService],
})
export class DailyExpanseModule {}
