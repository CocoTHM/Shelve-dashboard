import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Code d\'autorisation Discord',
    example: 'AbCdEfGhIjKlMnOpQrStUvWxYz',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'ID du serveur Discord (optionnel)',
    example: '123456789012345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  serverId?: string;
}

export class CallbackDto {
  @ApiProperty({
    description: 'Code d\'autorisation Discord',
    example: 'AbCdEfGhIjKlMnOpQrStUvWxYz',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'State (contient serverId encodé)',
    required: false,
  })
  @IsString()
  @IsOptional()
  state?: string;
}
