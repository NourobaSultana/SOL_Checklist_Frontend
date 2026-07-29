import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { QuestionsService } from './questions.service';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
  ) {}

  // ============================
  // Get All Questions
  // User/Admin/Sub Admin
  // ============================
  @Roles(
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.USER,
  )
  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  // ============================
  // Get Single Question
  // ============================
  @Roles(
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.USER,
  )
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.questionsService.findOne(id);
  }

  // ============================
  // Create Question
  // Admin Only
  // ============================
  @Roles(UserRole.ADMIN)
  @Post()
  create(
    @Body()
    createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionsService.create(
      createQuestionDto,
    );
  }

  // ============================
  // Update Question
  // Admin Only
  // ============================
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body()
    updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(
      id,
      updateQuestionDto,
    );
  }

  // ============================
  // Delete Question
  // Admin Only
  // ============================
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.questionsService.remove(id);
  }
}