// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DbService } from 'src/core/services/db-service/db.service';
import { ChatHistoryModel } from './chat.schema';

@Injectable()
export class ChatService {
  private readonly OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  private readonly OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;
  private readonly OPENROUTER_URL = process.env.OPENROUTER_URL!;
  private readonly ChatHistoryModel: typeof ChatHistoryModel;
  constructor(private readonly dbService: DbService) {
    this.ChatHistoryModel = this.dbService.sqlService.ChatHistoryModel;
  }

  async handleMessage(userMessage: string, sessionId = 'default') {
    // Save user message to DB
    await this.ChatHistoryModel.create({
      sessionId,
      role: 'user',
      content: userMessage,
    });

    const history = await this.ChatHistoryModel.findAll({
      where: { sessionId },
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
    return await this.ChatHistoryModel.create({
      sessionId,
      role: 'assistant',
      content: botReply,
    });
  }
}
