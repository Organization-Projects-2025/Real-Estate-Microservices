/* eslint-disable prettier/prettier */
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AgentService } from './agent.service';

@Controller()
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  // Helper method to handle errors and return error objects
  private handleError(error: any, defaultMessage: string) {
    console.error('[Agent Service Error]', error);

    let message = error.response || error.message || defaultMessage;
    let statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

    // Transform MongoDB validation errors into user-friendly messages
    if (error.name === 'ValidationError' && error.errors) {
      const fieldErrors = Object.keys(error.errors).map((field) => {
        const err = error.errors[field];
        // Transform technical field names to readable ones
        const fieldName = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();

        if (err.kind === 'required') {
          return `${fieldName} is required`;
        } else if (err.kind === 'enum') {
          return `${fieldName} must be one of: ${err.enumValues.join(', ')}`;
        } else if (err.kind === 'min' || err.kind === 'max') {
          return `${fieldName} ${err.message}`;
        } else {
          return `${fieldName} is invalid`;
        }
      });
      message = fieldErrors.join('. ');
      statusCode = HttpStatus.BAD_REQUEST;
    }
    // Handle string-based MongoDB validation errors
    else if (
      typeof message === 'string' &&
      message.includes('validation failed')
    ) {
      statusCode = HttpStatus.BAD_REQUEST;

      // Extract field validation errors from the message
      const matches = message.matchAll(
        /(\w+(?:\.\w+)*): Path `\w+` is required\./g
      );
      const fields = Array.from(matches).map((match) => {
        const field = match[1];
        // Transform field names (e.g., "phoneNumber" -> "Phone Number")
        const fieldName = field
          .split('.')
          .pop() // Get last part for nested fields
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
        return fieldName;
      });

      if (fields.length > 0) {
        message = `Please fill in the following required fields: ${fields.join(
          ', '
        )}`;
      }
    }

    return {
      status: 'error',
      message,
      statusCode,
      isError: true,
    };
  }

  @MessagePattern({ cmd: 'createAgent' })
  async create(@Payload() agentData: any) {
    try {
      return await this.agentService.create(agentData);
    } catch (error) {
      return this.handleError(error, 'Failed to create agent');
    }
  }

  @MessagePattern({ cmd: 'getAllAgents' })
  async findAll() {
    try {
      return await this.agentService.findAll();
    } catch (error) {
      return this.handleError(error, 'Failed to fetch agents');
    }
  }

  @MessagePattern({ cmd: 'getAgentById' })
  async findOne(@Payload() id: string) {
    try {
      return await this.agentService.findById(id);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch agent');
    }
  }

  @MessagePattern({ cmd: 'updateAgent' })
  async update(@Payload() data: { id: string; updateData: any }) {
    try {
      return await this.agentService.update(data.id, data.updateData);
    } catch (error) {
      return this.handleError(error, 'Failed to update agent');
    }
  }

  @MessagePattern({ cmd: 'deleteAgent' })
  async remove(@Payload() id: string) {
    try {
      return await this.agentService.delete(id);
    } catch (error) {
      return this.handleError(error, 'Failed to delete agent');
    }
  }

  @MessagePattern({ cmd: 'getAgentPhoneNumber' })
  async getPhoneNumber(@Payload() id: string) {
    try {
      return await this.agentService.getPhoneNumber(id);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch agent phone number');
    }
  }

  @MessagePattern({ cmd: 'getAgentByEmail' })
  async findByEmail(@Payload() email: string) {
    try {
      return await this.agentService.findByEmail(email);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch agent by email');
    }
  }

  @MessagePattern({ cmd: 'deactivateAgentByEmail' })
  async deactivateByEmail(@Payload() email: string) {
    try {
      return await this.agentService.deactivateByEmail(email);
    } catch (error) {
      return this.handleError(error, 'Failed to deactivate agent');
    }
  }

  @MessagePattern({ cmd: 'reactivateAgentByEmail' })
  async reactivateByEmail(@Payload() email: string) {
    try {
      return await this.agentService.reactivateByEmail(email);
    } catch (error) {
      return this.handleError(error, 'Failed to reactivate agent');
    }
  }
}
