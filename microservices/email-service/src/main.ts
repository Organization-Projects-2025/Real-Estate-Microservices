/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: process.env.PORT ? parseInt(process.env.PORT) : 3007,
      },
    },
  );
  await app.listen();
  console.log(`Email Microservice is running on port ${process.env.PORT || 3007}`);
}
bootstrap();
