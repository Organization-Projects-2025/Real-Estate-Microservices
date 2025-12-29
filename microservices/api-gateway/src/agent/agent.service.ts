/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AgentService {
  constructor(
    @Inject('AGENT_SERVICE') private readonly agentClient: ClientProxy
  ) {}

  private async sendCommand(cmd: string, data: any = {}): Promise<any> {
    try {
      return await firstValueFrom(this.agentClient.send({ cmd }, data));
    } catch (error) {
      throw error;
    }
  }

  async create(agentData: any): Promise<any> {
    return this.sendCommand('createAgent', agentData);
  }

  async findAll(): Promise<any> {
    return this.sendCommand('getAllAgents', {});
  }

  async findById(id: string): Promise<any> {
    return this.sendCommand('getAgentById', id);
  }

  async update(id: string, updateData: any): Promise<any> {
    return this.sendCommand('updateAgent', { id, updateData });
  }

  async delete(id: string): Promise<any> {
    return this.sendCommand('deleteAgent', id);
  }

  async getPhoneNumber(id: string): Promise<any> {
    return this.sendCommand('getAgentPhoneNumber', id);
  }

  async findByEmail(email: string): Promise<any> {
    return this.sendCommand('getAgentByEmail', email);
  }

  async deactivateByEmail(email: string): Promise<any> {
    return this.sendCommand('deactivateAgentByEmail', email);
  }

  async reactivateByEmail(email: string): Promise<any> {
    return this.sendCommand('reactivateAgentByEmail', email);
  }
}
