/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilterService } from './filter.service';
import { CreateFilterDto, UpdateFilterDto } from './filter.dto';

@Controller()
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @MessagePattern({ cmd: 'createFilter' })
  async create(@Payload() createFilterDto: CreateFilterDto) {
    try {
      return await this.filterService.create(createFilterDto);
    } catch (error) {
      console.error('[Filter Microservice CreateFilter Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAllFilters' })
  async findAll(@Payload() payload?: { category?: string }) {
    try {
      return await this.filterService.findAll(payload?.category);
    } catch (error) {
      console.error('[Filter Microservice GetAllFilters Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getFilterById' })
  async findOne(@Payload() id: string) {
    try {
      return await this.filterService.findById(id);
    } catch (error) {
      console.error('[Filter Microservice GetFilterById Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateFilter' })
  async update(
    @Payload() data: { id: string; updateFilterDto: UpdateFilterDto }
  ) {
    try {
      return await this.filterService.update(data.id, data.updateFilterDto);
    } catch (error) {
      console.error('[Filter Microservice UpdateFilter Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteFilter' })
  async remove(@Payload() id: string) {
    try {
      return await this.filterService.delete(id);
    } catch (error) {
      console.error('[Filter Microservice DeleteFilter Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getFiltersByCategory' })
  async findByCategory(@Payload() category: string) {
    try {
      return await this.filterService.findByCategory(category);
    } catch (error) {
      console.error('[Filter Microservice GetFiltersByCategory Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteCategoryFilters' })
  async deleteByCategory(@Payload() category: string) {
    try {
      return await this.filterService.deleteByCategory(category);
    } catch (error) {
      console.error('[Filter Microservice DeleteCategoryFilters Error]', error);
      throw error;
    }
  }
}
