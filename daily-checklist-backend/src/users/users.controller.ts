import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UsersService } from './users.service';

import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // ==================================
  // MY PROFILE
  // ==================================
  @Roles(
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.USER,
  )
 @Get('profile')
getProfile(@Req() req: any) {
  console.log('✅ GET PROFILE ROUTE');

  return this.usersService.getProfile(req.user.userId);
}

  // ==================================
  // UPDATE PROFILE
  // ==================================
  @Roles(
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.USER,
  )
  @Patch('profile')
  updateProfile(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(
      req.user.userId,
      updateUserDto,
    );
  }

  // ==================================
  // CHANGE PASSWORD
  // ==================================
  @Roles(
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.USER,
  )
  @Patch('change-password')
  changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      dto,
    );
  }

  // ==================================
  // UPLOAD PROFILE IMAGE
  // ==================================
  @Roles(
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.USER,
  )
  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/profile',

        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);

          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(
      req.user.userId,
      file,
    );
  }

  // ==================================
  // GET ALL USERS
  // ADMIN ONLY
  // ==================================
  @Roles(UserRole.ADMIN)
  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  // ==================================
  // GET USER BY ID
  // ADMIN & SUB ADMIN
  // ==================================
  @Roles(
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
  )
  @Get(':id')
findById(@Param('id') id: string) {
  console.log('❌ FIND BY ID:', id);

  return this.usersService.findById(id);
}

  // ==================================
  // UPDATE USER ROLE
  // ADMIN ONLY
  // ==================================
  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.usersService.updateUserRole(
      id,
      updateRoleDto.role,
    );
  }

  // ==================================
  // DELETE USER
  // ADMIN ONLY
  // ==================================
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
  ) {
    await this.usersService.deleteUser(id);

    return {
      message:
        'User deleted successfully',
    };
  }
}