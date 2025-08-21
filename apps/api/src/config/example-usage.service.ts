import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ExampleService {
  constructor(private readonly configService: ConfigService) {}

  getAppInfo() {
    return {
      port: this.configService.get<number>("port"),
      environment: this.configService.get<string>("nodeEnv"),
      databaseUrl: this.configService.get<string>("database.url"),
      // You can access nested config values using dot notation
    };
  }

  isDevelopment(): boolean {
    return this.configService.get<string>("nodeEnv") === "development";
  }

  isProduction(): boolean {
    return this.configService.get<string>("nodeEnv") === "production";
  }
}
