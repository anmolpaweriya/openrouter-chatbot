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
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatIdDto, ChatRequestDto, CreateChatSessionDto } from './chat.dto';
import { RequestDto } from 'src/core/dtos/request.dto';
import { UserGuard } from 'src/core/guards/guards';

@UseGuards(UserGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/message')
  async chat(@Body() body: ChatRequestDto) {
    return await this.chatService.handleMessage(body.message, body.chatId);
  }

  @Post('new-chat')
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
  async getChatHistory(@Req() res: RequestDto) {
    return await this.chatService.getChatHistory(res.userId);
  }
}
