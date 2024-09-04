import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DynamodbService } from './dynamodb.service';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateTableDto } from './dto/create-table.dto';

@ApiTags('dynamodb')
@Controller('dynamodb')
export class DynamodbController {
  constructor(private readonly dynamodbService: DynamodbService) {}

  @Post('create-with-details')
  @ApiOperation({
    summary: 'Create an item with id, name, and phone in DynamoDB',
  })
  @ApiBody({ type: CreateItemDto })
  async createItemWithDetails(
    @Body()
    body: {
      tableName: string;
      id: string;
      name: string;
      phone: string;
    },
  ) {
    await this.dynamodbService.createItemWithDetails(
      body.tableName,
      body.id,
      body.name,
      body.phone,
    );
  }

  @Delete('delete/:tableName/:id')
  @ApiOperation({ summary: 'Delete an item from DynamoDB' })
  async deleteItem(
    @Param('tableName') tableName: string,
    @Param('id') id: string,
  ) {
    await this.dynamodbService.deleteItem(tableName, { id });
  }

  @Put('update')
  @ApiOperation({ summary: 'Update an item in DynamoDB' })
  @ApiBody({
    description: 'Update item details',
    type: CreateItemDto,
  })
  async updateItem(
    @Body()
    body: {
      tableName: string;
      id: string;
      name?: string;
      phone?: string;
    },
  ) {
    const updateExpression = [];
    const expressionAttributeValues: Record<string, any> = {};

    if (body.name) {
      updateExpression.push('name = :name');
      expressionAttributeValues[':name'] = body.name;
    }

    if (body.phone) {
      updateExpression.push('phone = :phone');
      expressionAttributeValues[':phone'] = body.phone;
    }

    await this.dynamodbService.updateItem(
      body.tableName,
      { id: body.id },
      `SET ${updateExpression.join(', ')}`,
      expressionAttributeValues,
    );
  }

  @Get('query')
  @ApiOperation({ summary: 'Query items from DynamoDB' })
  @ApiQuery({ name: 'tableName', type: String, required: true })
  @ApiQuery({ name: 'keyConditionExpression', type: String, required: true })
  @ApiQuery({ name: 'expressionAttributeValues', type: String, required: true })
  async queryItems(
    @Query('tableName') tableName: string,
    @Query('keyConditionExpression') keyConditionExpression: string,
    @Query('expressionAttributeValues') expressionAttributeValues: string,
  ) {
    const parsedValues = JSON.parse(expressionAttributeValues);
    return this.dynamodbService.queryItems(
      tableName,
      keyConditionExpression,
      parsedValues,
    );
  }

  @Get('scan')
  @ApiOperation({ summary: 'Scan items from DynamoDB with filter' })
  @ApiQuery({ name: 'tableName', type: String, required: true })
  @ApiQuery({ name: 'filterExpression', type: String, required: true })
  @ApiQuery({ name: 'expressionAttributeValues', type: String, required: true })
  async scanItems(
    @Query('tableName') tableName: string,
    @Query('filterExpression') filterExpression: string,
    @Query('expressionAttributeValues') expressionAttributeValues: string,
  ) {
    const parsedValues = JSON.parse(expressionAttributeValues);
    return this.dynamodbService.scanItems(
      tableName,
      filterExpression,
      parsedValues,
    );
  }
  @Post('create-table')
  @ApiOperation({ summary: 'Create a new DynamoDB table' })
  @ApiBody({
    description: 'Table name to create',
    type: CreateTableDto,
  })
  async createTable(@Body() body: { tableName: string }) {
    await this.dynamodbService.createTable(body.tableName);
  }

  @Post('delete-table')
  @ApiOperation({ summary: 'Delete a DynamoDB table' })
  @ApiBody({
    description: 'Table name to delete',
    type: CreateTableDto,
  })
  async deleteTable(@Body() body: { tableName: string }) {
    await this.dynamodbService.deleteTable(body.tableName);
  }
  @Get('list-tables')
  @ApiOperation({ summary: 'List all tables in DynamoDB' })
  async listTables() {
    return this.dynamodbService.listTables();
  }
  @Get('items/:tableName')
  async listItems(@Param('tableName') tableName: string): Promise<any[]> {
    return this.dynamodbService.listItems(tableName);
  }
}
