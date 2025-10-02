import { ChatHistoryModel } from 'src/modules/chatbot/chat.schema';

export const MONGOOSE_MODELS = {};

export const SQL_MODELS = {
  ChatHistoryModel: ChatHistoryModel.setup,
};
