import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { StoreModule } from './store/store.module';
import { AuthModule } from './auth/auth.module';
import { UniversitiesModule } from './universities/universities.module';
import { ApplicationsModule } from './applications/applications.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    StoreModule,
    AuthModule,
    UniversitiesModule,
    ApplicationsModule,
    LlmModule,
  ],
})
export class AppModule {}
