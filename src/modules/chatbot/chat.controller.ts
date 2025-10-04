// src/chat/chat.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Query,
  Res,
  Req,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ChatIdDto,
  ChatRequestDto,
  CreateChatSessionDto,
  FileUploadDto,
} from './chat.dto';
import { RequestDto } from 'src/core/dtos/request.dto';
import { UserGuard } from 'src/core/guards/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/message')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  async chat(@Body() body: ChatRequestDto) {
    // console.log(file);
    return await this.chatService.handleMessage(body.message, body.chatId);
  }

  @Post('new-chat')
  @UseGuards(UserGuard)
  async createChatRoom(
    @Body() body: CreateChatSessionDto,
    @Req() req: RequestDto,
  ) {
    return await this.chatService.createChatSession(body, req.userId);
  }

  @Get('/messages')
  async getAllMessagesHistory(@Query() query: ChatIdDto) {
    return await this.chatService.getChatMessages(query.chatId);
  }

  @Get('/rooms')
  @UseGuards(UserGuard)
  async getChatHistory(@Req() res: RequestDto) {
    return await this.chatService.getChatHistory(res.userId);
  }

  @Delete('/rooms')
  async deleteChatHistory(@Query() query: ChatIdDto) {
    return await this.chatService.deleteChatHistory(query.chatId);
  }
}
