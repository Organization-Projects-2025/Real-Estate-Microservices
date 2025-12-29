/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AgentService } from './agent.service';

@Controller('agents')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() agentData: any) {
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
            this.authClient.send({ cmd: 'updateUser' }, { 
              userId: user._id, 
              userData: { role: 'agent' } 
            })
          );
        }
      } catch (error) {
        console.error('Failed to update user role to agent:', error.message);
        // Agent was created, but role update failed - log but don't fail the request
      }
    }
    
    return result;
  }

  @Get()
  async findAll() {
    // Get all agents
    const agentsResult = await this.agentService.findAll();
    
    if (agentsResult.status !== 'success' || !agentsResult.data?.agents) {
      return agentsResult;
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

      return {
        status: 'success',
        results: filteredAgents.length,
        data: { agents: filteredAgents },
      };
    } catch (error) {
      console.error('Failed to fetch users for filtering:', error.message);
      // If we can't get users, just filter by agent status
      const filteredAgents = agentsResult.data.agents.filter(
        (agent: any) => agent.status !== 'inactive'
      );
      return {
        status: 'success',
        results: filteredAgents.length,
        data: { agents: filteredAgents },
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentService.findById(id);
  }

  @Get(':id/phone')
  async getPhoneNumber(@Param('id') id: string) {
    return this.agentService.getPhoneNumber(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.agentService.findByEmail(email);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.agentService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.agentService.delete(id);
  }
}
