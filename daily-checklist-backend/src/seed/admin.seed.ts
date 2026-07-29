import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schema/user.schema';
import { UserRole } from '../common/enums/role.enum';

@Injectable()
export class AdminSeed implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL');

    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD');

    const adminExists = await this.userModel.findOne({
      email: adminEmail,
    });

    if (adminExists) {
      console.log('✅ Admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword!,
      10,
    );

    await this.userModel.create({
      name: 'Administrator',

      email: adminEmail,

      password: hashedPassword,

      role: UserRole.ADMIN,
    });

    console.log('✅ Default admin created successfully.');
  }
}