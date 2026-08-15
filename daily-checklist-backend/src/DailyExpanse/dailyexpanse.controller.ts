import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import {UserRole } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DailyExpanseService } from './dailyexpanse.service';
import { CreateDailyExpanseDto } from './dto/create.dailyexpanse.dto';

@Controller('dailyexpanse')
export class DailyExpanseController {
  constructor(
    private readonly dailyexpanseService: DailyExpanseService,
  ) {}

  // ==========================================
  // USER SAVE DAILY EXPENSE
  // ==========================================
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createdailyexpansedto: CreateDailyExpanseDto,
    @Req() req: any,
  ) {
    return this.dailyexpanseService.create(
      createdailyexpansedto,
      req.user,
    );
  }

  // ==========================================
  // USER DAILY EXPENSE HISTORY
  // ==========================================
  @UseGuards(AuthGuard('jwt'))
  @Get('my-history')
  async myHistory(@Req() req: any) {
    return this.dailyexpanseService.getMyHistory(
      req.user.userId,
    );
  }

  // ==========================================
// ADMIN - ALL DAILY EXPENSE HISTORY
// ==========================================
@UseGuards(AuthGuard('jwt'))
@Roles(UserRole.ADMIN)
@Get('history')
async history() {
  return this.dailyexpanseService.getAllHistory();
}
}