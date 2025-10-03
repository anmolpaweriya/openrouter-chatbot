import {
  ChatHistoryModel,
  ChatMessageModel,
} from 'src/modules/chatbot/chat.schema';
import {
  CourseModel,
  SubjectModel,
  TimetableModel,
} from 'src/modules/courses/courses.schema';
import { FacultyModel } from 'src/modules/faculty/faculty.schema';

export const MONGOOSE_MODELS = {};

export const SQL_MODELS = {
  ChatHistoryModel: ChatHistoryModel.setup,
  ChatMessageModel: ChatMessageModel.setup,
  CoursesModel: CourseModel.setup,
  SubjectModel: SubjectModel.setup,
  TimetableModel: TimetableModel.setup,
  FacultyModel: FacultyModel.setup,
};
