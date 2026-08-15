import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==========================================
  // ALL ADMIN HISTORY
  // ==========================================
  @Get('history')
  async getHistory(
    @Query('type') type?: string,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.adminService.getHistory({
      type,
      userId,
      search,
      fromDate,
      toDate,
      page: Number(page),
      limit: Number(limit),
    });
  }

  // ==========================================
  // DELETE HISTORY
  // ==========================================
  @Delete('history/:type/:id')
  async deleteHistory(@Param('type') type: string, @Param('id') id: string) {
    return this.adminService.deleteHistory(type, id);
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }
}
