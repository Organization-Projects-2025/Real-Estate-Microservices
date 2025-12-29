/* eslint-disable prettier/prettier */
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PropertyService } from './property.service';

@Controller()
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  // Helper method to handle errors and return error objects
  private handleError(error: any, defaultMessage: string) {
    console.error('[Property Service Error]', error);

    let message = error.response || error.message || defaultMessage;
    let statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

    // Transform MongoDB validation errors into user-friendly messages
    if (error.name === 'ValidationError' && error.errors) {
      const fieldErrors = Object.keys(error.errors).map((field) => {
        const err = error.errors[field];
        // Transform technical field names to readable ones
        const fieldName = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();

        if (err.kind === 'required') {
          return `${fieldName} is required`;
        } else if (err.kind === 'enum') {
          return `${fieldName} must be one of: ${err.enumValues.join(', ')}`;
        } else if (err.kind === 'min' || err.kind === 'max') {
          return `${fieldName} ${err.message}`;
        } else {
          return `${fieldName} is invalid`;
        }
      });
      message = fieldErrors.join('. ');
      statusCode = HttpStatus.BAD_REQUEST;
    }
    // Handle string-based MongoDB validation errors
    else if (
      typeof message === 'string' &&
      message.includes('Property validation failed')
    ) {
      statusCode = HttpStatus.BAD_REQUEST;

      // Extract field validation errors from the message
      const matches = message.matchAll(
        /(\w+(?:\.\w+)*): Path `\w+` is required\./g
      );
      const fields = Array.from(matches).map((match) => {
        const field = match[1];
        // Transform field names (e.g., "subType" -> "Sub Type", "address.street" -> "Street")
        const fieldName = field
          .split('.')
          .pop() // Get last part for nested fields
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
        return fieldName;
      });

      if (fields.length > 0) {
        message = `Please fill in the following required fields: ${fields.join(
          ', '
        )}`;
      }
    }

    return {
      status: 'error',
      message,
      statusCode,
      isError: true,
    };
  }

  @MessagePattern({ cmd: 'createProperty' })
  async create(@Payload() propertyData: any) {
    try {
      return await this.propertyService.create(propertyData);
    } catch (error) {
      return this.handleError(error, 'Failed to create property');
    }
  }

  @MessagePattern({ cmd: 'getAllProperties' })
  async findAll() {
    try {
      return await this.propertyService.findAll();
    } catch (error) {
      return this.handleError(error, 'Failed to fetch properties');
    }
  }

  @MessagePattern({ cmd: 'getPropertyById' })
  async findOne(@Payload() id: string) {
    try {
      return await this.propertyService.findById(id);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch property');
    }
  }

  @MessagePattern({ cmd: 'updateProperty' })
  async update(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.propertyService.update(data.id, data.updateData);
    } catch (error) {
      return this.handleError(error, 'Failed to update property');
    }
  }

  @MessagePattern({ cmd: 'deleteProperty' })
  async remove(@Payload() id: string) {
    try {
      return await this.propertyService.delete(id);
    } catch (error) {
      return this.handleError(error, 'Failed to delete property');
    }
  }

  @MessagePattern({ cmd: 'getPropertiesByUser' })
  async findByUser(@Payload() userId: string) {
    try {
      return await this.propertyService.findByUser(userId);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch user properties');
    }
  }

  @MessagePattern({ cmd: 'getPropertiesByListingType' })
  async findByListingType(@Payload() listingType: string) {
    try {
      return await this.propertyService.findByListingType(listingType);
    } catch (error) {
      return this.handleError(
        error,
        'Failed to fetch properties by listing type'
      );
    }
  }

  @MessagePattern({ cmd: 'searchProperties' })
  async search(@Payload() filters: any) {
    try {
      return await this.propertyService.search(filters);
    } catch (error) {
      return this.handleError(error, 'Failed to search properties');
    }
  }

  @MessagePattern({ cmd: 'getFeaturedProperties' })
  async getFeatured(@Payload() limit: number) {
    try {
      return await this.propertyService.getFeatured(limit);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch featured properties');
    }
  }
}
