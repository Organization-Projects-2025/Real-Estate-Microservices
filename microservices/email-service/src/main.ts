import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? Number(process.env.PORT) : 3002;
  await app.listen(port);
  console.log(`Email service (Nest) listening on port ${port}`);
}

bootstrap();
