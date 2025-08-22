import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {PromptService} from './prompt.service';
import {CreatePromptDto} from './dto/create-prompt.dto';
import {UpdatePromptDto} from './dto/update-prompt.dto';

@Controller('prompts')
export class PromptController {
  constructor(private service: PromptService) {
  }

  @Get() list() {
    return this.service.list();
  }

  @Get(':id') get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post() create(@Body() dto: CreatePromptDto) {
    return this.service.create(dto);
  }

  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdatePromptDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
