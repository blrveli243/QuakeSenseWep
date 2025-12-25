import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateNeedDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number; // Frontend'den (VictimDashboard) gelen ID buraya düşer
}