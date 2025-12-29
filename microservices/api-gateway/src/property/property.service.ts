/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PropertyService {
  constructor(
    @Inject('PROPERTY_SERVICE') private readonly propertyClient: ClientProxy
  ) {}

  private async sendCommand(cmd: string, data: any = {}): Promise<any> {
    try {
      return await firstValueFrom(this.propertyClient.send({ cmd }, data));
    } catch (error) {
      throw error;
    }
  }

  async create(propertyData: any): Promise<any> {
    return this.sendCommand('createProperty', propertyData);
  }

  async findAll(): Promise<any> {
    return this.sendCommand('getAllProperties', {});
  }

  async findById(id: string): Promise<any> {
    return this.sendCommand('getPropertyById', id);
  }

  async update(id: string, updateData: any): Promise<any> {
    return this.sendCommand('updateProperty', { id, updateData });
  }

  async delete(id: string): Promise<any> {
    return this.sendCommand('deleteProperty', id);
  }

  async findByUser(userId: string): Promise<any> {
    return this.sendCommand('getPropertiesByUser', userId);
  }

  async findByListingType(listingType: string): Promise<any> {
    return this.sendCommand('getPropertiesByListingType', listingType);
  }

  async search(filters: any): Promise<any> {
    return this.sendCommand('searchProperties', filters);
  }

  async getFeatured(limit: number): Promise<any> {
    return this.sendCommand('getFeaturedProperties', limit);
  }
}
