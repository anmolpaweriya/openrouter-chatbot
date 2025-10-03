// src/chat/chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { DbService } from 'src/core/services/db-service/db.service';
import { ChatHistoryModel, ChatMessageModel } from './chat.schema';
import { CreateChatSessionDto } from './chat.dto';
import { ASSISTANCE_GREETING, INITIAL_MODEL_DATA } from './chat.constants';
import { CourseService } from '../courses/courses.services';
import { FacultyService } from '../faculty/faculty.services';

@Injectable()
export class ChatService {
  private readonly OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  private readonly OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;
  private readonly OPENROUTER_URL = process.env.OPENROUTER_URL!;
  private readonly ChatMessageModel: typeof ChatMessageModel;
  private readonly ChatHistoryModel: typeof ChatHistoryModel;
  constructor(
    private readonly dbService: DbService,
    private readonly courseService: CourseService,
    private readonly facultyService: FacultyService,
  ) {
    this.ChatMessageModel = this.dbService.sqlService.ChatMessageModel;
    this.ChatHistoryModel = this.dbService.sqlService.ChatHistoryModel;
  }

  private async getModelTrainingData(userId: string) {
    const data = [
      ...INITIAL_MODEL_DATA.map((content) => ({
        role: 'system',
        content,
      })),
    ];
    try {
      const course = await this.courseService.getUserCourse(userId);
      data.push({
        role: 'system',
        content: `I am enrolled in this course: ${JSON.stringify(course)}`,
      });
    } catch (err) {
      console.log(err);
    }

    const faculties = await this.facultyService.findAll();
    data.push({
      role: 'system',
      content: `these are my universities faculties : ${JSON.stringify(faculties)}`,
    });

    const subjects = await this.courseService.getSubjects();
    data.push({
      role: 'system',
      content: `these are my universities subjects with their timetable : ${JSON.stringify(subjects)}`,
    });

    return data;
  }

  async getChatRoomById(id: string) {
    const room = await this.ChatHistoryModel.findByPk(id);
    if (!room) throw new NotFoundException('Room does not exists');
    return room?.dataValues;
  }

  async handleMessage(userMessage: string, chatId: string) {
    const room = await this.getChatRoomById(chatId);
    await this.ChatMessageModel.create({
      chatId,
      role: 'user',
      content: userMessage,
    });

    const history = await this.ChatMessageModel.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
    });
    const trainingData = await this.getModelTrainingData(room.userId);
    // Convert DB history to OpenAI-compatible format
    const formattedMessages = [
      ...trainingData,
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
