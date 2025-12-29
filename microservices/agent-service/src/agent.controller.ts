/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AgentService } from './agent.service';

@Controller()
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ cmd: 'createAgent' })
  async create(@Payload() agentData: any) {
    try {
      return await this.agentService.create(agentData);
    } catch (error) {
      console.error('[Agent Microservice CreateAgent Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAllAgents' })
  async findAll() {
    try {
      return await this.agentService.findAll();
    } catch (error) {
      console.error('[Agent Microservice GetAllAgents Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAgentById' })
  async findOne(@Payload() id: string) {
    try {
      return await this.agentService.findById(id);
    } catch (error) {
      console.error('[Agent Microservice GetAgentById Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateAgent' })
  async update(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.agentService.update(data.id, data.updateData);
    } catch (error) {
      console.error('[Agent Microservice UpdateAgent Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteAgent' })
  async remove(@Payload() id: string) {
    try {
      return await this.agentService.delete(id);
    } catch (error) {
      console.error('[Agent Microservice DeleteAgent Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAgentPhoneNumber' })
  async getPhoneNumber(@Payload() id: string) {
    try {
      return await this.agentService.getPhoneNumber(id);
    } catch (error) {
      console.error('[Agent Microservice GetAgentPhoneNumber Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAgentByEmail' })
  async findByEmail(@Payload() email: string) {
    try {
      return await this.agentService.findByEmail(email);
    } catch (error) {
      console.error('[Agent Microservice GetAgentByEmail Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deactivateAgentByEmail' })
  async deactivateByEmail(@Payload() email: string) {
    try {
      return await this.agentService.deactivateByEmail(email);
    } catch (error) {
      console.error('[Agent Microservice DeactivateAgentByEmail Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'reactivateAgentByEmail' })
  async reactivateByEmail(@Payload() email: string) {
    try {
      return await this.agentService.reactivateByEmail(email);
    } catch (error) {
      console.error('[Agent Microservice ReactivateAgentByEmail Error]', error);
      throw error;
    }
  }
}
