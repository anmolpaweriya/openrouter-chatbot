import { Injectable } from '@nestjs/common';
import {
  CourseModel,
  SubjectModel,
  TimetableModel,
  UserCoursesModel,
  Weekday,
} from '../courses/courses.schema';
import { DbService } from 'src/core/services/db-service/db.service';

import * as dayjs from 'dayjs'; // Optional: for better day handling

@Injectable()
export class DashboardService {
  private readonly CourseModel: typeof CourseModel;
  private readonly SubjectModel: typeof SubjectModel;
  private readonly UserCoursesModel: typeof UserCoursesModel;
  private readonly TimetableModel: typeof TimetableModel;

  constructor(private readonly dbService: DbService) {
    this.CourseModel = this.dbService.sqlService.CoursesModel;
    this.SubjectModel = this.dbService.sqlService.SubjectModel;
    this.UserCoursesModel = this.dbService.sqlService.UserCoursesModel;
    this.TimetableModel = this.dbService.sqlService.TimetableModel;
  }

  async getAdminDashboardData(userId: string) {
    return 'hello';
  }

  async getStudentDashboardData(userId: string) {
    // Step 1: Get the student's courseId
    const userCourse = await this.UserCoursesModel.findOne({
      where: { userId },
    });

    if (!userCourse) {
      throw new Error('User is not enrolled in any course');
    }

    const courseId = userCourse.courseId;

    // Step 2: Get today's day (e.g., "Monday")
    const today = dayjs().format('dddd') as Weekday;

    // Step 3: Get all timetables for this course
    const todayLectures = await this.TimetableModel.findAll({
      where: {
        courseId,
        day: today,
      },
      include: [
        {
          model: this.SubjectModel,
          as: 'subject',
        },
      ],
    });

    // Step 4: Count total for today and this week
    const totalTodayLectures = todayLectures.length;

    const totalWeekLectures = await this.TimetableModel.count({
      where: {
        courseId,
      },
    });

    return {
      subjectsCount: await this.SubjectModel.count({ where: { courseId } }),
      totalTodayLectures,
      totalWeekLectures,
      todayLectures, // Full details of lectures today
    };
  }
}
