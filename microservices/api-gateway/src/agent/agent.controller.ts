/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AgentService } from './agent.service';
import { extractErrorMessage } from '../common/error.utils';

@Controller('agents')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {}

  @Post()
  async create(@Body() agentData: any, @Res() res: Response) {
    try {
      // First create the agent record
      const result = await this.agentService.create(agentData);

      // If agent was created successfully, update the user's role to 'agent'
      if (result.status === 'success' && agentData.email) {
        try {
          // Get user by email and update their role
          const usersResponse = await firstValueFrom(
            this.authClient.send({ cmd: 'getAllUsers' }, {})
          );

          const user = usersResponse.data?.users?.find(
            (u: any) => u.email === agentData.email
          );

          if (user) {
            await firstValueFrom(
              this.authClient.send(
                { cmd: 'updateUser' },
                {
                  userId: user._id,
                  userData: { role: 'agent' },
                }
              )
            );
          }
        } catch (error) {
          console.error('Failed to update user role to agent:', error.message);
          // Agent was created, but role update failed - log but don't fail the request
        }
      }

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Agent Create Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      // Get all agents
      const agentsResult = await this.agentService.findAll();

      if (agentsResult.status !== 'success' || !agentsResult.data?.agents) {
        return res.status(HttpStatus.OK).json(agentsResult);
      }

      // Get all users to check their active status
      try {
        const usersResponse = await firstValueFrom(
          this.authClient.send({ cmd: 'getAllUsers' }, {})
        );

        const users = usersResponse.data?.users || [];

        // Create a map of email to user active status
        const userActiveMap = new Map();
        users.forEach((user: any) => {
          userActiveMap.set(user.email, user.active !== false);
        });

        // Filter agents: only include those with status 'active' AND whose linked user is active
        const filteredAgents = agentsResult.data.agents.filter((agent: any) => {
          const agentIsActive = agent.status !== 'inactive';
          const userIsActive = userActiveMap.get(agent.email) !== false;
          return agentIsActive && userIsActive;
        });

        return res.status(HttpStatus.OK).json({
          status: 'success',
          results: filteredAgents.length,
          data: { agents: filteredAgents },
        });
      } catch (error) {
        console.error('Failed to fetch users for filtering:', error.message);
        // If we can't get users, just filter by agent status
        const filteredAgents = agentsResult.data.agents.filter(
          (agent: any) => agent.status !== 'inactive'
        );
        return res.status(HttpStatus.OK).json({
          status: 'success',
          results: filteredAgents.length,
          data: { agents: filteredAgents },
        });
      }
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Agent GetAll Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.agentService.findById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Agent GetById Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get(':id/phone')
  async getPhoneNumber(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.agentService.getPhoneNumber(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Agent GetPhoneNumber Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string, @Res() res: Response) {
    try {
      const result = await this.agentService.findByEmail(email);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Agent GetByEmail Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Res() res: Response
  ) {
    try {
      const result = await this.agentService.update(id, updateData);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Agent Update Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.agentService.delete(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const { message, statusCode } = extractErrorMessage(error);
      console.error('[Agent Delete Error]', error);
      return res.status(statusCode).json({ status: 'error', message });
    }
  }
}
