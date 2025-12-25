import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Need } from './entities/need.entity';
import { Category } from './entities/category.entity';
import { CreateNeedDto } from './dto/create-need.dto';

@Injectable()
export class NeedsService implements OnModuleInit {
  constructor(
    @InjectRepository(Need) private needsRepository: Repository<Need>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    const count = await this.categoryRepository.count();
    if (count === 0) {
      await this.categoryRepository.save({ name: 'Genel Yardım' });
    }
  }

  async create(createNeedDto: CreateNeedDto) {
    const newNeed = this.needsRepository.create(createNeedDto);
    return await this.needsRepository.save(newNeed);
  }

  async findAll() {
    return await this.needsRepository.find({
      relations: ['user', 'category'],
      order: { id: 'DESC' },
    });
  }

  async updateStatus(id: number, status: string) {
    const need = await this.needsRepository.findOne({ where: { id } });
    if (!need) throw new NotFoundException('Talep bulunamadı.');
    need.status = status;
    return await this.needsRepository.save(need);
  }

  async remove(id: number) {
    const need = await this.needsRepository.findOne({ where: { id } });
    if (!need) throw new NotFoundException('Talep bulunamadı.');
    return await this.needsRepository.remove(need);
  }
}
