import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import { PromptModule } from "./prompt/prompt.module";
import { McpModule } from "./mcp/mcp.module";
import { Prompt } from "./prompt/prompt.entity";
import { McpConfig } from "./mcp/mcp-config.entity";
import configuration from "./config/configuration";
import { validateConfig } from "./config/config.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [".env", ".env.local"],
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get<string>("database.url"),
        entities: [Prompt, McpConfig],
        synchronize: configService.get<string>("nodeEnv") === "development",
        migrations: [__dirname + "/migrations/*.{ts,js}"],
      }),
      inject: [ConfigService],
    }),
    PromptModule,
    McpModule,
  ],
})
export class AppModule {}
