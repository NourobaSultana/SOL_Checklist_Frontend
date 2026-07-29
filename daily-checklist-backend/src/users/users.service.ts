import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User, UserDocument } from './schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // ============================
  // Register User
  // ============================
  async createUser(registerDto: RegisterDto): Promise<User> {
    const { name, email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    return user;
  }

  // ============================
  // Find User by Email
  // (Include password for login)
  // ============================
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password');
  }

  // ============================
  // Find User by ID
  // ============================
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ============================
  // Get All Users
  // ============================
  async findAllUsers(): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 });
  }

  // ============================
  // Update User Role
  // ============================
  async updateUserRole(
    id: string,
    role: UserRole,
  ): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
      },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ============================
  // Delete User
  // ============================
  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }


  // ============================
// Get My Profile
// ============================
async getProfile(id: string): Promise<User> {
  const user = await this.userModel
    .findById(id)
    .select('-password');

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}


// ============================
// Update Profile
// ============================
async updateProfile(
  id: string,
  dto: UpdateUserDto,
): Promise<User> {
  const user = await this.userModel.findByIdAndUpdate(
    id,
    dto,
    {
      new: true,
    },
  ).select('-password');

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}


// ============================
// Change Password
// ============================
async changePassword(
  id: string,
  dto: ChangePasswordDto,
) {
  const user = await this.userModel
    .findById(id)
    .select('+password');

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const match = await bcrypt.compare(
    dto.currentPassword,
    user.password,
  );

  if (!match) {
    throw new BadRequestException(
      'Current password is incorrect',
    );
  }

  if (dto.newPassword !== dto.confirmPassword) {
    throw new BadRequestException(
      'Passwords do not match',
    );
  }

  user.password = await bcrypt.hash(
    dto.newPassword,
    10,
  );

  await user.save();

  return {
    message: 'Password updated successfully',
  };
}



// ============================
// Upload Avatar
// ============================
async uploadAvatar(
  id: string,
  file: Express.Multer.File,
) {
  const user = await this.userModel.findById(id);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.avatar = file.filename;

  await user.save();

  return {
    message: 'Avatar updated successfully',
    avatar: file.filename,
  };
}


}