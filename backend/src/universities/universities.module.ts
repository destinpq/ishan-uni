import { Module } from '@nestjs/common';
import { UniversitiesController } from './universities.controller';
import { DiscoveryService } from './discovery.service';

@Module({
  providers: [DiscoveryService],
  controllers: [UniversitiesController],
  exports: [DiscoveryService],
})
export class UniversitiesModule {}
