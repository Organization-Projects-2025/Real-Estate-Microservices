/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './review.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(reviewData: any): Promise<any> {
    try {
      console.log('=== CREATE REVIEW DEBUG ===');
      console.log('Raw reviewData:', JSON.stringify(reviewData));
      console.log('Agent value:', reviewData.agent);
      console.log('Agent type:', typeof reviewData.agent);
      
      // Validate agent is provided and is a valid ObjectId
      if (!reviewData.agent) {
        console.error('Agent is missing!');
        throw new RpcException('Agent ID is required');
      }
      
      // Convert agent to ObjectId for storage
      const agentId = new Types.ObjectId(reviewData.agent);
      
      console.log('Converted agentId:', agentId);
      
      const reviewToCreate = {
        ...reviewData,
        agent: agentId,
      };
      
      console.log('Final review object to create:', JSON.stringify(reviewToCreate));
      
      const review = await this.reviewModel.create(reviewToCreate);
      
      console.log('Created review:', JSON.stringify(review));
      console.log('Review agent field:', review.agent);
      console.log('=== END DEBUG ===');
      
      return {
        status: 'success',
        data: { review },
      };
    } catch (error: any) {
      console.error('Review creation error:', error);
      throw new RpcException(error?.message || 'Failed to create review');
    }
  }

  async findAll(): Promise<any> {
    const reviews = await this.reviewModel.find().lean();
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }

  async findById(id: string): Promise<any> {
    const review = await this.reviewModel.findById(id).lean();
    if (!review) {
      throw new RpcException('Review not found');
    }
    return {
      status: 'success',
      data: { review },
    };
  }

  async update(id: string, updateData: any): Promise<any> {
    const review = await this.reviewModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      throw new RpcException('Review not found');
    }
    return {
      status: 'success',
      data: { review },
    };
  }

  async delete(id: string): Promise<any> {
    const review = await this.reviewModel.findByIdAndDelete(id);
    if (!review) {
      throw new RpcException('Review not found');
    }
    return {
      status: 'success',
      message: 'Review deleted successfully',
    };
  }

  async findByAgent(agentId: string): Promise<any> {
    const reviews = await this.reviewModel.find({ agent: agentId });
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }

  async getRandom(limit: number = 3): Promise<any> {
    const numLimit = Number(limit) || 3;
    const reviews = await this.reviewModel
      .find({ status: 'active' })
      .limit(numLimit)
      .lean();
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }
}
