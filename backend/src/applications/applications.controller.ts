import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { Application, ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly svc: ApplicationsService) {}

  @Get()
  list(@CurrentUser() u: AuthUser): Application[] {
    return this.svc.listForUser(u.id);
  }

  @Post()
  create(
    @CurrentUser() u: AuthUser,
    @Body() dto: CreateApplicationDto,
  ): Application {
    return this.svc.create(u.id, dto);
  }

  @Get(':id')
  get(@CurrentUser() u: AuthUser, @Param('id') id: string): Application {
    return this.svc.getOwned(u.id, id);
  }

  @Put(':id')
  update(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ): Application {
    return this.svc.update(u.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() u: AuthUser, @Param('id') id: string): void {
    this.svc.remove(u.id, id);
  }
}
