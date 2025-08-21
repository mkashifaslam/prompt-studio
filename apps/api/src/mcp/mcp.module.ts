import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { McpConfig } from './mcp-config.entity';
import { McpService } from './mcp.service';
import { McpController } from './mcp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([McpConfig])],
  providers: [McpService],
  controllers: [McpController],
})
export class McpModule {}
