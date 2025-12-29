/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './property.model';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  async create(propertyData: any): Promise<any> {
    try {
      // Normalize optional date fields
      if (propertyData?.buildDate === '') {
        delete propertyData.buildDate;
      } else if (typeof propertyData?.buildDate === 'string') {
        const d = new Date(propertyData.buildDate);
        if (!isNaN(d.getTime())) {
          propertyData.buildDate = d;
        } else {
          delete propertyData.buildDate;
        }
      }
      const property = await this.propertyModel.create(propertyData);
      return {
        status: 'success',
        data: { property },
      };
    } catch (error: any) {
      throw new RpcException(error?.message || 'Failed to create property');
    }
  }

  async findAll(): Promise<any> {
    const properties = await this.propertyModel.find();
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async findById(id: string): Promise<any> {
    const property = await this.propertyModel.findById(id);
    if (!property) {
      throw new RpcException('Property not found');
    }
    return {
      status: 'success',
      data: { property },
    };
  }

  async update(id: string, updateData: any): Promise<any> {
    // Normalize optional date fields on update
    if (updateData?.buildDate === '') {
      delete updateData.buildDate;
    } else if (typeof updateData?.buildDate === 'string') {
      const d = new Date(updateData.buildDate);
      if (!isNaN(d.getTime())) {
        updateData.buildDate = d;
      } else {
        delete updateData.buildDate;
      }
    }
    const property = await this.propertyModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      throw new RpcException('Property not found');
    }
    return {
      status: 'success',
      data: { property },
    };
  }

  async delete(id: string): Promise<any> {
    const property = await this.propertyModel.findByIdAndDelete(id);
    if (!property) {
      throw new RpcException('Property not found');
    }
    return {
      status: 'success',
      message: 'Property deleted successfully',
    };
  }

  async findByUser(userId: string): Promise<any> {
    const properties = await this.propertyModel.find({ user: userId });
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async findByListingType(listingType: string): Promise<any> {
    const properties = await this.propertyModel.find({ listingType });
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async search(filters: any): Promise<any> {
    const query: any = {};

    if (filters.listingType) query.listingType = filters.listingType;
    if (filters.propertyType) query.propertyType = filters.propertyType;
    if (filters.subType) query.subType = filters.subType;
    if (filters.status) query.status = filters.status;
    if (filters.city) query['address.city'] = { $regex: filters.city, $options: 'i' };
    if (filters.state) query['address.state'] = { $regex: filters.state, $options: 'i' };
    if (filters.minPrice) query.price = { ...query.price, $gte: filters.minPrice };
    if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
    if (filters.bedrooms) query['features.bedrooms'] = { $gte: filters.bedrooms };
    if (filters.bathrooms) query['features.bathrooms'] = { $gte: filters.bathrooms };

    const properties = await this.propertyModel.find(query);
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async getFeatured(limit: number = 6): Promise<any> {
    const properties = await this.propertyModel
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit);
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }
}
