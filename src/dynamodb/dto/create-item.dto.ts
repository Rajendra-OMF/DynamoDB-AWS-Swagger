import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ description: 'Table name in DynamoDB' })
  tableName: string;

  @ApiProperty({ description: 'Item ID' })
  id: string;

  @ApiProperty({ description: 'Item name' })
  name?: string;

  @ApiProperty({ description: 'Item phone number' })
  phone?: string;
}
