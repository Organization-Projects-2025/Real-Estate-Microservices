/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PropertyService } from './property.service';

@Controller()
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @MessagePattern({ cmd: 'createProperty' })
  async create(@Payload() propertyData: any) {
    try {
      return await this.propertyService.create(propertyData);
    } catch (error) {
      console.error('[Property Microservice CreateProperty Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAllProperties' })
  async findAll() {
    try {
      return await this.propertyService.findAll();
    } catch (error) {
      console.error('[Property Microservice GetAllProperties Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getPropertyById' })
  async findOne(@Payload() id: string) {
    try {
      return await this.propertyService.findById(id);
    } catch (error) {
      console.error('[Property Microservice GetPropertyById Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateProperty' })
  async update(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.propertyService.update(data.id, data.updateData);
    } catch (error) {
      console.error('[Property Microservice UpdateProperty Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteProperty' })
  async remove(@Payload() id: string) {
    try {
      return await this.propertyService.delete(id);
    } catch (error) {
      console.error('[Property Microservice DeleteProperty Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getPropertiesByUser' })
  async findByUser(@Payload() userId: string) {
    try {
      return await this.propertyService.findByUser(userId);
    } catch (error) {
      console.error('[Property Microservice GetPropertiesByUser Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getPropertiesByListingType' })
  async findByListingType(@Payload() listingType: string) {
    try {
      return await this.propertyService.findByListingType(listingType);
    } catch (error) {
      console.error(
        '[Property Microservice GetPropertiesByListingType Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'searchProperties' })
  async search(@Payload() filters: any) {
    try {
      return await this.propertyService.search(filters);
    } catch (error) {
      console.error('[Property Microservice SearchProperties Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getFeaturedProperties' })
  async getFeatured(@Payload() limit: number) {
    try {
      return await this.propertyService.getFeatured(limit);
    } catch (error) {
      console.error(
        '[Property Microservice GetFeaturedProperties Error]',
        error
      );
      throw error;
    }
  }
}
