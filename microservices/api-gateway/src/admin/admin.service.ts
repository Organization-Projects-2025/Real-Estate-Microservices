/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(@Inject('ADMIN_SERVICE') private client: ClientProxy) {}

  private async sendCommand(cmd: string, data: any = {}): Promise<any> {
    try {
      return await firstValueFrom(this.client.send({ cmd }, data));
    } catch (error) {
      throw error;
    }
  }

  async createFilter(createFilterDto: any) {
    return this.sendCommand('createFilter', createFilterDto);
  }

  async getAllFilters(category?: string) {
    // Nest microservices clientProxy.send does not allow null/undefined payloads.
    // Always send an object payload.
    return this.sendCommand('getAllFilters', {
      category: category ?? undefined,
    });
  }

  async getFilterById(id: string) {
    return this.sendCommand('getFilterById', id);
  }

  async updateFilter(id: string, updateFilterDto: any) {
    return this.sendCommand('updateFilter', { id, updateFilterDto });
  }

  async deleteFilter(id: string) {
    return this.sendCommand('deleteFilter', id);
  }

  async getFiltersByCategory(category: string) {
    return this.sendCommand('getFiltersByCategory', category);
  }

  async deleteCategoryFilters(category: string) {
    return this.sendCommand('deleteCategoryFilters', category);
  }
}
