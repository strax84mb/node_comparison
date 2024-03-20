import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders, repoProviders } from './database.providers';
import { AirportService } from './services/airport.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    ...databaseProviders,
    ...repoProviders,
    AppService,
    AirportService,
  ],
})
export class AppModule {}
