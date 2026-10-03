import { Controller, Get, Param, UseGuards, Inject } from '@nestjs/common';
import { PoliciesService } from './policies.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('policies')
export class PoliciesController {
  constructor(@Inject(PoliciesService) private readonly policiesService: PoliciesService) {}

  @Get(':orderId')
  getPolicy(
    @Param('orderId') orderId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.policiesService.getPolicyByOrder(orderId, user.id);
  }

  @Get()
  listPolicies(@CurrentUser() user: { id: string }) {
    return this.policiesService.listMyPolicies(user.id);
  }
}
