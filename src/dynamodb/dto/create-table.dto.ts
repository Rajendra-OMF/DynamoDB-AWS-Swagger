import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ description: 'Table name in DynamoDB' })
  tableName: string;
}
