/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { extractErrorMessage } from '../common/error.utils';

@Controller('filters')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createFilter(@Body() createFilterDto: any, @Res() res: Response) {
    try {
      const result = await this.adminService.createFilter(createFilterDto);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Admin CreateFilter Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get()
  async getAllFilters(
    @Res() res: Response,
    @Query('category') category?: string
  ) {
    try {
      const result = await this.adminService.getAllFilters(category);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Admin GetAllFilters Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get('category/:category')
  async getFiltersByCategory(
    @Param('category') category: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.adminService.getFiltersByCategory(category);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Admin GetFiltersByCategory Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get(':id')
  async getFilterById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.adminService.getFilterById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Admin GetFilterById Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Put(':id')
  async updateFilter(
    @Param('id') id: string,
    @Body() updateFilterDto: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.adminService.updateFilter(id, updateFilterDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Admin UpdateFilter Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Delete(':id')
  async deleteFilter(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.adminService.deleteFilter(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Admin DeleteFilter Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Delete('category/:category')
  async deleteCategoryFilters(
    @Param('category') category: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.adminService.deleteCategoryFilters(category);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Admin DeleteCategoryFilters Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }
}
