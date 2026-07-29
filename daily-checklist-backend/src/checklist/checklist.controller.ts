import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';


import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@Controller('checklist')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChecklistController {
  constructor(
    private readonly checklistService: ChecklistService,
  ) {}

  // ==========================================
  // USER SUBMIT CHECKLIST
  // ==========================================
  @Roles(
    UserRole.USER,
    UserRole.SUB_ADMIN,
    UserRole.ADMIN,
  )
  @Post()
  async create(
    @Req() req: any,
    @Body() createChecklistDto: CreateChecklistDto,
  ) {
    return this.checklistService.create(
      req.user.userId,
      createChecklistDto,
    );
  }


  

  // ==========================================
  // MY HISTORY
  // ==========================================
  @Roles(
    UserRole.USER,
    UserRole.SUB_ADMIN,
    UserRole.ADMIN,
  )
  @Get('my-history')
  async myHistory(@Req() req: any) {
    return this.checklistService.getMyHistory(
      req.user.userId,
    );
  }

  // ==========================================
  // MY HISTORY BY DATE
  // ==========================================
  @Roles(
    UserRole.USER,
    UserRole.SUB_ADMIN,
    UserRole.ADMIN,
  )
  @Get('my-history/:date')
  async myHistoryByDate(
    @Req() req: any,
    @Param('date') date: string,
  ) {
    return this.checklistService.getByDate(
      req.user.userId,
      date,
    );
  }

  // ==========================================
  // ADMIN - ALL HISTORY
  // ==========================================
  @Roles(UserRole.ADMIN)
  @Get('history')
  async history() {
    return this.checklistService.getAllHistory();
  }


  @Get(":id")
  getChecklistById(
    @Param("id") id: string,
  ) {
    return this.checklistService.findById(id);
  }

  // ==========================================
  // ADMIN - USER HISTORY
  // ==========================================
  @Roles(UserRole.ADMIN)
  @Get('user/:id')
  async userHistory(
    @Param('id') id: string,
  ) {
    return this.checklistService.getUserHistory(id);
  }
}