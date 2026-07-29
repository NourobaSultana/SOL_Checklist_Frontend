import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../users/schema/user.schema';
import { AdminSeed } from './admin.seed';

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [AdminSeed],
})
export class SeedModule {}