import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Gereksinim: Frontend ve Backend iletişimi için CORS aktif edildi
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // Gereksinim: Bulut sunucusu (Render) PORT'u ortam değişkeninden alır
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
