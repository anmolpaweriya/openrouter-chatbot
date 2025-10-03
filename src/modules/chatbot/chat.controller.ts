// src/chat/chat.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ChatIdDto,
  ChatRequestDto,
  CreateChatSessionDto,
  UserIdDto,
} from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/message')
  async chat(@Body() body: ChatRequestDto) {
    return await this.chatService.handleMessage(body.message, body.chatId);
  }

  @Post('new-chat')
  async createChatRoom(@Body() body: CreateChatSessionDto) {
    return await this.chatService.createChatSession(body);
  }

  @Get('/messages')
  async getAllMessagesHistory(@Query() query: ChatIdDto) {
    return await this.chatService.getChatMessages(query.chatId);
  }

  @Get('/rooms')
  async getChatHistory(@Query() query: UserIdDto) {
    return await this.chatService.getChatHistory(query.userId);
  }
}
