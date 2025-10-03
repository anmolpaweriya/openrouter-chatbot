import { ChatHistoryModel } from 'src/modules/chatbot/chat.schema';
import {
  CourseModel,
  SubjectModel,
  TimetableModel,
} from 'src/modules/courses/courses.schema';

export const MONGOOSE_MODELS = {};

export const SQL_MODELS = {
  ChatHistoryModel: ChatHistoryModel.setup,
  CoursesModel: CourseModel.setup,
  SubjectModel: SubjectModel.setup,
  TimetableModel: TimetableModel.setup,
};
