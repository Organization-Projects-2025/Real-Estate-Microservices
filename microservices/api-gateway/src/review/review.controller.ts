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
import { ReviewService } from './review.service';
import { extractErrorMessage } from '../common/error.utils';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() reviewData: any, @Res() res: Response) {
    try {
      const result = await this.reviewService.create(reviewData);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Review Create Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.reviewService.findAll();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Review GetAll Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Get('random')
  async getRandom(@Query('limit') limit: number = 3, @Res() res: Response) {
    try {
      const result = await this.reviewService.getRandom(limit);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Review GetRandom Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Get('agent/:agentId')
  async findByAgent(@Param('agentId') agentId: string, @Res() res: Response) {
    try {
      const result = await this.reviewService.findByAgent(agentId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Review GetByAgent Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.reviewService.findById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Review GetById Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.reviewService.update(id, updateData);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Review Update Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.reviewService.delete(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Review Delete Error]', error);
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
  }
}
