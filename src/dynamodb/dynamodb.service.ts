import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
  ScanCommand,
  DeleteTableCommand,
  CreateTableCommand,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class DynamodbService {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({ region: 'us-west-2' }); // Replace with your region
  }

  async createItem(
    tableName: string,
    item: Record<string, any>,
  ): Promise<void> {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
    });
    await this.client.send(command);
  }

  async getItem(tableName: string, key: Record<string, any>): Promise<any> {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: marshall(key),
    });
    const result = await this.client.send(command);
    return result.Item ? unmarshall(result.Item) : null;
  }

  async updateItem(
    tableName: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
  ): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: tableName,
      Key: marshall(key),
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    });
    await this.client.send(command);
  }

  async deleteItem(tableName: string, key: Record<string, any>): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: marshall(key),
    });
    await this.client.send(command);
  }

  async createItemWithDetails(
    tableName: string,
    id: string,
    name: string,
    phone: string,
  ): Promise<void> {
    const item = { id, name, phone };
    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
    });
    await this.client.send(command);
  }

  async queryItems(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
  ): Promise<any[]> {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    });
    const result = await this.client.send(command);
    return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
  }

  async scanItems(
    tableName: string,
    filterExpression: string,
    expressionAttributeValues: Record<string, any>,
  ): Promise<any[]> {
    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    });
    const result = await this.client.send(command);
    return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
  }
  async createTable(tableName: string): Promise<void> {
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }, // String type
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });
    await this.client.send(command);
  }

  async deleteTable(tableName: string): Promise<void> {
    const command = new DeleteTableCommand({
      TableName: tableName,
    });
    await this.client.send(command);
  }
  async listTables(): Promise<string[]> {
    const command = new ListTablesCommand({});
    const result = await this.client.send(command);
    return result.TableNames || [];
  }
  async listItems(tableName: string): Promise<any[]> {
    const command = new ScanCommand({
      TableName: tableName,
    });
    const result = await this.client.send(command);
    return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
  }
}
