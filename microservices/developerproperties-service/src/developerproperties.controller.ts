/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeveloperPropertiesService } from './developerproperties.service';

@Controller()
export class DeveloperPropertiesController {
  constructor(private readonly service: DeveloperPropertiesService) {}

  // Project endpoints
  @MessagePattern({ cmd: 'createProject' })
  async createProject(@Payload() data: any) {
    try {
      return await this.service.createProject(data);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice CreateProject Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAllProjects' })
  async getAllProjects() {
    try {
      return await this.service.getAllProjects();
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetAllProjects Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getProjectById' })
  async getProjectById(@Payload() id: string) {
    try {
      return await this.service.getProjectById(id);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetProjectById Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getProjectsByUser' })
  async getProjectsByUser(@Payload() userId: string) {
    try {
      return await this.service.getProjectsByUser(userId);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetProjectsByUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateProject' })
  async updateProject(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.service.updateProject(data.id, data.updateData);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice UpdateProject Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteProject' })
  async deleteProject(@Payload() id: string) {
    try {
      return await this.service.deleteProject(id);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice DeleteProject Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateProjectForUser' })
  async updateProjectForUser(
    @Payload() data: { userId: string; projectId: string; updateData: any }
  ) {
    try {
      return await this.service.updateProjectForUser(
        data.userId,
        data.projectId,
        data.updateData
      );
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice UpdateProjectForUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteProjectForUser' })
  async deleteProjectForUser(
    @Payload() data: { userId: string; projectId: string }
  ) {
    try {
      return await this.service.deleteProjectForUser(
        data.userId,
        data.projectId
      );
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice DeleteProjectForUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'createProjectForUser' })
  async createProjectForUser(
    @Payload() data: { userId: string; projectData: any }
  ) {
    try {
      return await this.service.createProject({
        ...data.projectData,
        developerId: data.userId,
      });
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice CreateProjectForUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAllDevelopers' })
  async getAllDevelopers() {
    try {
      return await this.service.getAllDevelopers();
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetAllDevelopers Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getDeveloperById' })
  async getDeveloperById(@Payload() id: string) {
    try {
      return await this.service.getDeveloperById(id);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetDeveloperById Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateDeveloper' })
  async updateDeveloper(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.service.updateDeveloper(data.id, data.updateData);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice UpdateDeveloper Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteDeveloper' })
  async deleteDeveloper(@Payload() id: string) {
    try {
      return await this.service.deleteDeveloper(id);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice DeleteDeveloper Error]',
        error
      );
      throw error;
    }
  }

  // Developer Property endpoints
  @MessagePattern({ cmd: 'createDeveloperProperty' })
  async createProperty(@Payload() data: any) {
    try {
      return await this.service.createProperty(data);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice CreateDeveloperProperty Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAllDeveloperProperties' })
  async getAllProperties() {
    try {
      return await this.service.getAllProperties();
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetAllDeveloperProperties Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getDeveloperPropertyById' })
  async getPropertyById(@Payload() id: string) {
    try {
      return await this.service.getPropertyById(id);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetDeveloperPropertyById Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateDeveloperProperty' })
  async updateProperty(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.service.updateProperty(data.id, data.updateData);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice UpdateDeveloperProperty Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteDeveloperProperty' })
  async deleteProperty(@Payload() id: string) {
    try {
      return await this.service.deleteProperty(id);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice DeleteDeveloperProperty Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getPropertiesByProject' })
  async getPropertiesByProject(@Payload() projectId: string) {
    try {
      return await this.service.getPropertiesByProject(projectId);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetPropertiesByProject Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'createPropertyForProject' })
  async createPropertyForProject(
    @Payload() data: { userId: string; projectId: string; propertyData: any }
  ) {
    try {
      return await this.service.createPropertyForProject(
        data.userId,
        data.projectId,
        data.propertyData
      );
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice CreatePropertyForProject Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getPropertiesByUser' })
  async getPropertiesByUser(@Payload() userId: string) {
    try {
      return await this.service.getPropertiesByUser(userId);
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetPropertiesByUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'createPropertyForUser' })
  async createPropertyForUser(
    @Payload() data: { userId: string; propertyData: any }
  ) {
    try {
      return await this.service.createPropertyForUser(
        data.userId,
        data.propertyData
      );
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice CreatePropertyForUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updatePropertyForUser' })
  async updatePropertyForUser(
    @Payload() data: { userId: string; propertyId: string; updateData: any }
  ) {
    try {
      return await this.service.updatePropertyForUser(
        data.userId,
        data.propertyId,
        data.updateData
      );
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice UpdatePropertyForUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deletePropertyForUser' })
  async deletePropertyForUser(
    @Payload() data: { userId: string; propertyId: string }
  ) {
    try {
      return await this.service.deletePropertyForUser(
        data.userId,
        data.propertyId
      );
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice DeletePropertyForUser Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getProjectsWithPropertiesByDeveloper' })
  async getProjectsWithPropertiesByDeveloper(@Payload() developerId: string) {
    try {
      return await this.service.getProjectsWithPropertiesByDeveloper(
        developerId
      );
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetProjectsWithPropertiesByDeveloper Error]',
        error
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getFullHierarchy' })
  async getFullHierarchy() {
    try {
      return await this.service.getFullHierarchy();
    } catch (error) {
      console.error(
        '[DeveloperProperties Microservice GetFullHierarchy Error]',
        error
      );
      throw error;
    }
  }
}
