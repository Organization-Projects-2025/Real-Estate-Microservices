/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy
  ) {}

  private async sendCommand(cmd: string, data: any = {}): Promise<any> {
    try {
      return await firstValueFrom(this.reviewClient.send({ cmd }, data));
    } catch (error) {
      throw error;
    }
  }

  async create(reviewData: any): Promise<any> {
    return this.sendCommand('createReview', reviewData);
  }

  async findAll(): Promise<any> {
    return this.sendCommand('getAllReviews', {});
  }

  async findById(id: string): Promise<any> {
    return this.sendCommand('getReviewById', id);
  }

  async update(id: string, updateData: any): Promise<any> {
    return this.sendCommand('updateReview', { id, updateData });
  }

  async delete(id: string): Promise<any> {
    return this.sendCommand('deleteReview', id);
  }

  async findByAgent(agentId: string): Promise<any> {
    return this.sendCommand('getReviewsByAgent', agentId);
  }

  async getRandom(limit: number): Promise<any> {
    return this.sendCommand('getRandomReviews', limit);
  }
}
