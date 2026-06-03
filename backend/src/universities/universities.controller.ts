import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { DiscoveryService, University } from './discovery.service';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly discovery: DiscoveryService) {}

  // Frontend calls GET /universities?search=...&program=...&country=...
  @Get()
  list(
    @Query('search') search?: string,
    @Query('program') program?: string,
    @Query('country') country?: string,
    @Query('limit') limit?: string,
  ): Promise<University[]> {
    return this.discovery.discover({
      search,
      program,
      country,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // Explicit discover alias.
  @Get('discover')
  discover(
    @Query('q') q?: string,
    @Query('program') program?: string,
    @Query('country') country?: string,
    @Query('limit') limit?: string,
  ): Promise<University[]> {
    return this.discovery.discover({
      search: q,
      program,
      country,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string): University {
    const u = this.discovery.getById(id);
    if (!u) {
      throw new NotFoundException(
        'University not in cache. Run a search first.',
      );
    }
    return u;
  }
}
