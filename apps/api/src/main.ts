import "reflect-metadata";
import { Controller, Get, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
@Controller("health")
class HealthController {
  @Get() health() {
    return { status: "ok", service: "brendhouse-api" };
  }
}
@Module({ controllers: [HealthController] })
class AppModule {}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Brend House API")
      .setVersion("1")
      .setDescription(
        "Phase 1 foundation. Commerce endpoints are introduced in their implementation phases.",
      )
      .build(),
  );
  SwaggerModule.setup("api/docs", app, document);
  await app.listen(Number(process.env.PORT ?? 4000), "0.0.0.0");
}
void bootstrap();
