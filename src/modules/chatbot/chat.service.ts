// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DbService } from 'src/core/services/db-service/db.service';
import { ChatHistoryModel, ChatMessageModel } from './chat.schema';
import { CreateChatSessionDto } from './chat.dto';
import { ASSISTANCE_GREETING } from './chat.constants';

@Injectable()
export class ChatService {
  private readonly OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  private readonly OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;
  private readonly OPENROUTER_URL = process.env.OPENROUTER_URL!;
  private readonly ChatMessageModel: typeof ChatMessageModel;
  private readonly ChatHistoryModel: typeof ChatHistoryModel;
  constructor(private readonly dbService: DbService) {
    this.ChatMessageModel = this.dbService.sqlService.ChatMessageModel;
    this.ChatHistoryModel = this.dbService.sqlService.ChatHistoryModel;
  }

  async handleMessage(userMessage: string, chatId: string) {
    await this.ChatMessageModel.create({
      chatId,
      role: 'user',
      content: userMessage,
    });

    const history = await this.ChatMessageModel.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
    });

    // Convert DB history to OpenAI-compatible format
    const formattedMessages = [
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Send to OpenRouter API
    const response = await axios.post(
      this.OPENROUTER_URL,
      {
        model: this.OPENROUTER_MODEL,
        messages: formattedMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${this.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const botReply = response.data.choices[0].message.content;

    // Save bot reply to DB
    return await this.ChatMessageModel.create({
      chatId,
      role: 'assistant',
      content: botReply,
    });
  }

  async createChatSession(data: CreateChatSessionDto, userId: string) {
    const res = await this.ChatHistoryModel.create({
      title: data.title || 'New Chat',
      userId,
    });

    await this.ChatMessageModel.create({
      chatId: res.dataValues.id,
      role: 'assistant',
      content: ASSISTANCE_GREETING,
    });

    return res.dataValues;
  }

  async getChatMessages(chatId: string) {
    return this.ChatMessageModel.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
    });
  }

  async getChatHistory(userId: string) {
    return this.ChatHistoryModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async deleteChatHistory(id: string) {
    return this.ChatHistoryModel.destroy({ where: { id } });
  }
}
