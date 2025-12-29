/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DeveloperPropertiesService } from './developerproperties.service';
import { extractErrorMessage } from '../common/error.utils';

@Controller()
export class DeveloperPropertiesController {
  constructor(private readonly service: DeveloperPropertiesService) {}

  private sendError(res: Response, error: any, context: string) {
    const { message, statusCode } = extractErrorMessage(error);
    console.error(`[DeveloperProperties ${context} Error]`, error);
    return res.status(statusCode).json({ status: 'error', message });
  }

  // Developer endpoints
  @Post('developers')
  async createDeveloper(@Body() data: any, @Res() res: Response) {
    try {
      const result = await this.service.createDeveloper(data);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return this.sendError(res, error, 'CreateDeveloper');
    }
  }

  @Get('developers')
  async getAllDevelopers(@Res() res: Response) {
    try {
      const result = await this.service.getAllDevelopers();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetAllDevelopers');
    }
  }

  @Get('developers/:id')
  async getDeveloperById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.service.getDeveloperById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetDeveloperById');
    }
  }

  @Put('developers/:id')
  async updateDeveloper(
    @Param('id') id: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.updateDeveloper(id, data);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'UpdateDeveloper');
    }
  }

  @Delete('developers/:id')
  async deleteDeveloper(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.service.deleteDeveloper(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'DeleteDeveloper');
    }
  }

  // Developer Property endpoints
  @Post('developer-properties')
  async createProperty(@Body() data: any, @Res() res: Response) {
    try {
      const result = await this.service.createProperty(data);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return this.sendError(res, error, 'CreateProperty');
    }
  }

  @Get('developer-properties')
  async getAllProperties(@Res() res: Response) {
    try {
      const result = await this.service.getAllProperties();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetAllProperties');
    }
  }

  @Get('developer-properties/developer/:developerId')
  async getPropertiesByDeveloper(
    @Param('developerId') developerId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.getPropertiesByDeveloper(developerId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetPropertiesByDeveloper');
    }
  }

  @Get('developer-properties/user/:userId')
  async getPropertiesByUser(
    @Param('userId') userId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.getPropertiesByUser(userId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetPropertiesByUser');
    }
  }

  @Get('developer-properties/project/:projectId')
  async getPropertiesByProject(
    @Param('projectId') projectId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.getPropertiesByProject(projectId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetPropertiesByProject');
    }
  }

  @Post('developer-properties/user/:userId')
  async createPropertyForUser(
    @Param('userId') userId: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.createPropertyForUser(userId, data);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return this.sendError(res, error, 'CreatePropertyForUser');
    }
  }

  @Post('developer-properties/project/:userId/:projectId')
  async createPropertyForProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.createPropertyForProject(
        userId,
        projectId,
        data
      );
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return this.sendError(res, error, 'CreatePropertyForProject');
    }
  }

  @Put('developer-properties/user/:userId/:propertyId')
  async updatePropertyForUser(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.updatePropertyForUser(
        userId,
        propertyId,
        data
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'UpdatePropertyForUser');
    }
  }

  @Delete('developer-properties/user/:userId/:propertyId')
  async deletePropertyForUser(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.deletePropertyForUser(
        userId,
        propertyId
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'DeletePropertyForUser');
    }
  }

  // Project endpoints
  @Post('projects')
  async createProject(@Body() data: any, @Res() res: Response) {
    try {
      const result = await this.service.createProject(data);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return this.sendError(res, error, 'CreateProject');
    }
  }

  @Get('projects')
  async getAllProjects(@Res() res: Response) {
    try {
      const result = await this.service.getAllProjects();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetAllProjects');
    }
  }

  @Get('projects/:id')
  async getProjectById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.service.getProjectById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetProjectById');
    }
  }

  @Get('projects/user/:userId')
  async getProjectsByUser(
    @Param('userId') userId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.getProjectsByUser(userId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetProjectsByUser');
    }
  }

  @Put('projects/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.updateProject(id, data);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'UpdateProject');
    }
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.service.deleteProject(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'DeleteProject');
    }
  }

  @Put('projects/user/:userId/:projectId')
  async updateProjectForUser(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.updateProjectForUser(
        userId,
        projectId,
        data
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'UpdateProjectForUser');
    }
  }

  @Delete('projects/user/:userId/:projectId')
  async deleteProjectForUser(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.deleteProjectForUser(userId, projectId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'DeleteProjectForUser');
    }
  }

  @Post('projects/user/:userId')
  async createProjectForUser(
    @Param('userId') userId: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.createProjectForUser(userId, data);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return this.sendError(res, error, 'CreateProjectForUser');
    }
  }

  @Get('developer-properties/:id')
  async getPropertyById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.service.getPropertyById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetPropertyById');
    }
  }

  @Put('developer-properties/:id')
  async updateProperty(
    @Param('id') id: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.updateProperty(id, data);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'UpdateProperty');
    }
  }

  @Delete('developer-properties/:id')
  async deleteProperty(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.service.deleteProperty(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'DeleteProperty');
    }
  }

  @Get('projects-with-properties/developer/:developerId')
  async getProjectsWithPropertiesByDeveloper(
    @Param('developerId') developerId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.service.getProjectsWithPropertiesByDeveloper(
        developerId
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetProjectsWithPropertiesByDeveloper');
    }
  }

  @Get('projects-hierarchy')
  async getFullHierarchy(@Res() res: Response) {
    try {
      const result = await this.service.getFullHierarchy();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return this.sendError(res, error, 'GetFullHierarchy');
    }
  }
}
