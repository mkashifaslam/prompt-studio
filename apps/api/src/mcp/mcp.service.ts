import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { McpConfig } from './mcp-config.entity';
import { McpServerSchema } from './mcp.zod';

@Injectable()
export class McpService {
  constructor(@InjectRepository(McpConfig) private repo: Repository<McpConfig>) {}

  list() {
    return this.repo.find({ order: { updatedAt: 'DESC' } });
  }
  get(id: string) {
    return this.repo.findOneBy({ id });
  }

  async upsert(name: string, config: unknown) {
    const parsed = McpServerSchema.safeParse(config);
    if (!parsed.success) throw new BadRequestException(parsed.error.format());
    let item = await this.repo.findOne({ where: { name } });
    if (!item) item = this.repo.create({ name, config: parsed.data });
    else item.config = parsed.data;
    return this.repo.save(item);
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }
}
