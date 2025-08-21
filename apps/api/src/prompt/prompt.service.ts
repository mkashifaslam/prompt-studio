import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from './prompt.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';

@Injectable()
export class PromptService {
  constructor(@InjectRepository(Prompt) private repo: Repository<Prompt>) {}

  list() {
    return this.repo.find({ order: { updatedAt: 'DESC' } });
  }
  get(id: string) {
    return this.repo.findOneBy({ id });
  }

  async create(dto: CreatePromptDto) {
    const created = this.repo.create(dto);
    return await this.repo.save(created);
  }

  async update(id: string, dto: UpdatePromptDto) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Prompt not found');
    Object.assign(found, dto);
    return await this.repo.save(found);
  }

  async remove(id: string) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Prompt not found');
    await this.repo.remove(found);
    return { ok: true };
  }
}
