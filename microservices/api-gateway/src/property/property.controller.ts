/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PropertyService } from './property.service';
import { extractErrorMessage } from '../common/error.utils';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() propertyData: any, @Res() res: Response) {
    try {
      const result = await this.propertyService.create(propertyData);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property Create Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.propertyService.findAll();

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property GetAll Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit: number = 6, @Res() res: Response) {
    try {
      const result = await this.propertyService.getFeatured(limit);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property GetFeatured Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get('search')
  async search(@Query() filters: any, @Res() res: Response) {
    try {
      const result = await this.propertyService.search(filters);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property Search Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const result = await this.propertyService.findByUser(userId);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property GetByUser Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get('type/:listingType')
  async findByListingType(
    @Param('listingType') listingType: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.propertyService.findByListingType(listingType);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property GetByListingType Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.propertyService.findById(id);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property GetById Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.propertyService.update(id, updateData);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property Update Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.propertyService.delete(id);

      // Check if microservice returned an error
      if (result?.isError) {
        return res.status(result.statusCode || HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Property Delete Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }
}
