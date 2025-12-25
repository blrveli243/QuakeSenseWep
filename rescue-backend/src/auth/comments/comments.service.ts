import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(dto: CreateCommentDto) {
    const comment = this.commentRepository.create({
      content: dto.content,
      user: { id: dto.userId },
      need: { id: dto.needId },
    });
    return this.commentRepository.save(comment);
  }

  findByNeed(needId: number) {
    return this.commentRepository.find({
      where: { need: { id: needId } },
      relations: ['user'],
    });
  }
}
