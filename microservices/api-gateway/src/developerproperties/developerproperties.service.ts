/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeveloperPropertiesService {
  constructor(
    @Inject('DEVELOPERPROPERTIES_SERVICE') private client: ClientProxy
  ) {}

  private async sendCommand(cmd: string, data: any = {}): Promise<any> {
    try {
      return await firstValueFrom(this.client.send({ cmd }, data));
    } catch (error) {
      throw error;
    }
  }

  async createDeveloper(data: any) {
    return this.sendCommand('createDeveloper', data);
  }

  async getAllDevelopers() {
    return this.sendCommand('getAllDevelopers', {});
  }

  async getDeveloperById(id: string) {
    return this.sendCommand('getDeveloperById', id);
  }

  async updateDeveloper(id: string, data: any) {
    return this.sendCommand('updateDeveloper', { id, updateData: data });
  }

  async deleteDeveloper(id: string) {
    return this.sendCommand('deleteDeveloper', id);
  }

  async createProperty(data: any) {
    return this.sendCommand('createDeveloperProperty', data);
  }

  async getAllProperties() {
    return this.sendCommand('getAllDeveloperProperties', {});
  }

  async getPropertyById(id: string) {
    return this.sendCommand('getDeveloperPropertyById', id);
  }

  async updateProperty(id: string, data: any) {
    return this.sendCommand('updateDeveloperProperty', {
      id,
      updateData: data,
    });
  }

  async deleteProperty(id: string) {
    return this.sendCommand('deleteDeveloperProperty', id);
  }

  async getPropertiesByDeveloper(developerId: string) {
    return this.sendCommand('getPropertiesByDeveloper', developerId);
  }

  async getPropertiesByUser(userId: string) {
    return this.sendCommand('getPropertiesByUser', userId);
  }

  async getPropertiesByProject(projectId: string) {
    return this.sendCommand('getPropertiesByProject', projectId);
  }

  async createPropertyForUser(userId: string, propertyData: any) {
    return this.sendCommand('createPropertyForUser', { userId, propertyData });
  }

  async createPropertyForProject(
    userId: string,
    projectId: string,
    propertyData: any
  ) {
    return this.sendCommand('createPropertyForProject', {
      userId,
      projectId,
      propertyData,
    });
  }

  async updatePropertyForUser(
    userId: string,
    propertyId: string,
    updateData: any
  ) {
    return this.sendCommand('updatePropertyForUser', {
      userId,
      propertyId,
      updateData,
    });
  }

  async deletePropertyForUser(userId: string, propertyId: string) {
    return this.sendCommand('deletePropertyForUser', { userId, propertyId });
  }

  // Project methods
  async createProject(projectData: any) {
    return this.sendCommand('createProject', projectData);
  }

  async getAllProjects() {
    return this.sendCommand('getAllProjects', {});
  }

  async getProjectById(id: string) {
    return this.sendCommand('getProjectById', id);
  }

  async getProjectsByUser(userId: string) {
    return this.sendCommand('getProjectsByUser', userId);
  }

  async updateProject(id: string, updateData: any) {
    return this.sendCommand('updateProject', { id, updateData });
  }

  async deleteProject(id: string) {
    return this.sendCommand('deleteProject', id);
  }

  async updateProjectForUser(
    userId: string,
    projectId: string,
    updateData: any
  ) {
    return this.sendCommand('updateProjectForUser', {
      userId,
      projectId,
      updateData,
    });
  }

  async deleteProjectForUser(userId: string, projectId: string) {
    return this.sendCommand('deleteProjectForUser', { userId, projectId });
  }

  async createProjectForUser(userId: string, projectData: any) {
    return this.sendCommand('createProjectForUser', { userId, projectData });
  }

  async getProjectsWithPropertiesByDeveloper(developerId: string) {
    return this.sendCommand(
      'getProjectsWithPropertiesByDeveloper',
      developerId
    );
  }

  async getFullHierarchy() {
    return this.sendCommand('getFullHierarchy', {});
  }
}
