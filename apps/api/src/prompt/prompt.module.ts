import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from './prompt.entity';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prompt])],
  providers: [PromptService],
  controllers: [PromptController],
})
export class PromptModule {}
