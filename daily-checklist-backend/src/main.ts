import * as dns from 'node:dns';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  const config = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Serve uploaded files
  app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );

  await app.listen(config.get<number>('PORT') || 5000);

  console.log(
    `Server running on http://localhost:${
      config.get<number>('PORT') || 5000
    }`,
  );
}

bootstrap();