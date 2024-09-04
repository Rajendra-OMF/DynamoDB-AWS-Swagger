import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamodbService } from './dynamodb/dynamodb.service';
import { DynamodbController } from './dynamodb/dynamodb.controller';

@Module({
  imports: [],
  controllers: [AppController, DynamodbController],
  providers: [AppService, DynamodbService],
})
export class AppModule {}
