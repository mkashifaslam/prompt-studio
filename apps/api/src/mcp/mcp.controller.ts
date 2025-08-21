import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { McpService } from './mcp.service';

@Controller('mcp')
export class McpController {
  constructor(private service: McpService) {}

  @Get() list() {
    return this.service.list();
  }
  @Get(':id') get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post(':name') upsert(@Param('name') name: string, @Body() body: any) {
    return this.service.upsert(name, body);
  }

  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
