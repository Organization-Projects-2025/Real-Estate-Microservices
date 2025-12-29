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
      const review = await this.reviewModel.create(reviewData);
      return {
        status: 'success',
        data: { review },
      };
    } catch (error: any) {
      throw new RpcException(error?.message || 'Failed to create review');
    }
  }

  async findAll(): Promise<any> {
    const reviews = await this.reviewModel.aggregate([
      {
        $lookup: {
          from: 'agents',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $unwind: {
          path: '$agent',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }

  async findById(id: string): Promise<any> {
    const reviews = await this.reviewModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'agents',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $unwind: {
          path: '$agent',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    
    if (!reviews || reviews.length === 0) {
      throw new RpcException('Review not found');
    }
    return {
      status: 'success',
      data: { review: reviews[0] },
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
    const reviews = await this.reviewModel.aggregate([
      { $match: { status: 'active' } },
      { $sample: { size: numLimit } },
      {
        $lookup: {
          from: 'agents',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $unwind: {
          path: '$agent',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }
}
