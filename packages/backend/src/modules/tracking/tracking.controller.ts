import { Controller, Post, Body, Inject } from '@nestjs/common';
import { TrackingService } from './tracking.service.js';
import { TrackingDto } from './dto/tracking.dto.js';
import { Public } from '../../shared/decorators/public.decorator.js';

@Controller('tracking')
export class TrackingController {
  constructor(@Inject(TrackingService) private readonly trackingService: TrackingService) {}

  @Public()
  @Post()
  trackOrder(@Body() dto: TrackingDto) {
    return this.trackingService.trackOrder(dto);
  }
}
