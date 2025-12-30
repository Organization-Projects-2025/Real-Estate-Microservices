/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
    @Inject('AGENT_SERVICE') private readonly agentClient: ClientProxy,
  ) {}

  private async sendCommand(cmd: string, data: any = {}): Promise<any> {
    try {
      return await firstValueFrom(this.reviewClient.send({ cmd }, data));
    } catch (error) {
      throw error;
    }
  }

  private async getAgent(agentId: string): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.agentClient.send({ cmd: 'getAgentById' }, agentId),
      );
      return result?.data?.agent || null;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  }

  private async enrichReviewsWithAgents(reviews: any[]): Promise<any[]> {
    return Promise.all(
      reviews.map(async (review) => {
        if (review.agent) {
          const agent = await this.getAgent(review.agent.toString());
          return { ...review, agent };
        }
        return review;
      }),
    );
  }

  async create(reviewData: any): Promise<any> {
    const result = await this.sendCommand('createReview', reviewData);
    if (result?.data?.review?.agent) {
      const agent = await this.getAgent(result.data.review.agent.toString());
      return {
        ...result,
        data: { review: { ...result.data.review, agent } },
      };
    }
    return result;
  }

  async findAll(): Promise<any> {
    const result = await this.sendCommand('getAllReviews', {});
    if (result?.data?.reviews) {
      const enrichedReviews = await this.enrichReviewsWithAgents(
        result.data.reviews,
      );
      return { ...result, data: { reviews: enrichedReviews } };
    }
    return result;
  }

  async findById(id: string): Promise<any> {
    const result = await this.sendCommand('getReviewById', id);
    if (result?.data?.review?.agent) {
      const agent = await this.getAgent(result.data.review.agent.toString());
      return {
        ...result,
        data: { review: { ...result.data.review, agent } },
      };
    }
    return result;
  }

  async update(id: string, updateData: any): Promise<any> {
    return this.sendCommand('updateReview', { id, updateData });
  }

  async delete(id: string): Promise<any> {
    return this.sendCommand('deleteReview', id);
  }

  async findByAgent(agentId: string): Promise<any> {
    const result = await this.sendCommand('getReviewsByAgent', agentId);
    if (result?.data?.reviews) {
      const enrichedReviews = await this.enrichReviewsWithAgents(
        result.data.reviews,
      );
      return { ...result, data: { reviews: enrichedReviews } };
    }
    return result;
  }

  async getRandom(limit: number): Promise<any> {
    const result = await this.sendCommand('getRandomReviews', limit);
    if (result?.data?.reviews) {
      const enrichedReviews = await this.enrichReviewsWithAgents(
        result.data.reviews,
      );
      return { ...result, data: { reviews: enrichedReviews } };
    }
    return result;
  }
}
