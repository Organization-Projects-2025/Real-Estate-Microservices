/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { Agent, AgentSchema } from './agent.model';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../../.env'), override: true });

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-agent'),
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
