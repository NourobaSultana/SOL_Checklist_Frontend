import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create.appoinment.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@Controller('appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // ==========================================
  // USER SAVE APPOINTMENT
  // ==========================================
  @Roles(UserRole.USER, UserRole.SUB_ADMIN, UserRole.ADMIN)
  @Post()
  async create(
    @Body() createappointmentdto: CreateAppointmentDto,
    @Req() req: any,
  ) {
    return this.appointmentService.create(createappointmentdto, req.user);
  }

  // ==========================================
  // USER APPOINTMENT HISTORY
  // ==========================================
  @Roles(UserRole.USER, UserRole.SUB_ADMIN, UserRole.ADMIN)
  @Get('my-history')
  async myHistory(@Req() req: any) {
    return this.appointmentService.getMyHistory(req.user.userId);
  }

  // ==========================================
// ADMIN - ALL APPOINTMENT HISTORY
// ==========================================
@Roles(UserRole.ADMIN)
@Get('history')
async history() {
  return this.appointmentService.getAllHistory();
}
}
