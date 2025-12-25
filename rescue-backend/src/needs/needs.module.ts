import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';
import { Need } from './entities/need.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Need, Category])],
  controllers: [NeedsController],
  providers: [NeedsService],
})
export class NeedsModule {}
