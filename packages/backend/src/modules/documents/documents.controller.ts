import { Controller, Post, Get, Param, UseGuards, UseInterceptors, UploadedFile, Body, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service.js';
import { UploadDocumentDto } from './dto/upload-document.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller()
export class DocumentsController {
  constructor(@Inject(DocumentsService) private readonly documentsService: DocumentsService) {}

  @Post('orders/:id/documents')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Param('id') orderId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.uploadDocument(orderId, user.id, dto.type, file);
  }

  @Get('orders/:id/documents')
  getDocuments(
    @Param('id') orderId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.documentsService.getDocumentsByOrder(orderId, user.id);
  }
}
