import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { UsersModule } from '../users/users.module';

import {
  Checklist,
  ChecklistSchema,
} from './schema/checklist.schema';

@Module({
  imports: [
  UsersModule,
  MongooseModule.forFeature([
    {
      name: Checklist.name,
      schema: ChecklistSchema,
    },
  ]),
],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}