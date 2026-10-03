import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Inject } from '@nestjs/common';
import { QuotesService } from './quotes.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { Public } from '../../shared/decorators/public.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';

@Controller('quotes')
export class QuotesController {
  constructor(@Inject(QuotesService) private readonly quotesService: QuotesService) {}

  @Public()
  @Post()
  create(
    @Body() dto: CreateQuoteDto,
    @CurrentUser() user?: { id: string },
  ) {
    return this.quotesService.createQuote(user?.id, dto);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user?: { id: string },
  ) {
    return this.quotesService.getQuote(id, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuoteDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.quotesService.updateQuote(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.quotesService.deleteQuote(id, user.id);
  }
}
