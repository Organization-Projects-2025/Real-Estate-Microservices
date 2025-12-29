/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern({ cmd: 'createReview' })
  async create(@Payload() reviewData: any) {
    try {
      return await this.reviewService.create(reviewData);
    } catch (error) {
      console.error('[Review Microservice CreateReview Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAllReviews' })
  async findAll() {
    try {
      return await this.reviewService.findAll();
    } catch (error) {
      console.error('[Review Microservice GetAllReviews Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getReviewById' })
  async findOne(@Payload() id: string) {
    try {
      return await this.reviewService.findById(id);
    } catch (error) {
      console.error('[Review Microservice GetReviewById Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateReview' })
  async update(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.reviewService.update(data.id, data.updateData);
    } catch (error) {
      console.error('[Review Microservice UpdateReview Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteReview' })
  async remove(@Payload() id: string) {
    try {
      return await this.reviewService.delete(id);
    } catch (error) {
      console.error('[Review Microservice DeleteReview Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getReviewsByAgent' })
  async findByAgent(@Payload() agentId: string) {
    try {
      return await this.reviewService.findByAgent(agentId);
    } catch (error) {
      console.error('[Review Microservice GetReviewsByAgent Error]', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getRandomReviews' })
  async getRandom(@Payload() limit: number) {
    try {
      return await this.reviewService.getRandom(limit);
    } catch (error) {
      console.error('[Review Microservice GetRandomReviews Error]', error);
      throw error;
    }
  }
}
