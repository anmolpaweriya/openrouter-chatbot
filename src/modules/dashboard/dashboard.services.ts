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
import { FacultyModel } from '../faculty/faculty.schema';
import { BuildingModel } from '../building/building.schema';
import { col, fn } from 'sequelize';

@Injectable()
export class DashboardService {
  private readonly CourseModel: typeof CourseModel;
  private readonly SubjectModel: typeof SubjectModel;
  private readonly UserCoursesModel: typeof UserCoursesModel;
  private readonly TimetableModel: typeof TimetableModel;
  private readonly FacultyModel: typeof FacultyModel;
  private readonly BuildingModel: typeof BuildingModel;

  constructor(private readonly dbService: DbService) {
    this.CourseModel = this.dbService.sqlService.CoursesModel;
    this.SubjectModel = this.dbService.sqlService.SubjectModel;
    this.UserCoursesModel = this.dbService.sqlService.UserCoursesModel;
    this.TimetableModel = this.dbService.sqlService.TimetableModel;
    this.FacultyModel = this.dbService.sqlService.FacultyModel;
    this.BuildingModel = this.dbService.sqlService.BuildingModel;
  }

  async getAdminDashboardData() {
    const totalStudents = await this.UserCoursesModel.count();
    const totalFaculty = await this.FacultyModel.count();
    const totalCourses = await this.CourseModel.count();
    const totalBuildings = await this.BuildingModel.count();

    const departmentOverview = await CourseModel.findAll({
      attributes: [
        'id',
        'name',
        'code',
        [fn('COUNT', col('userCourses.id')), 'studentCount'],
      ],
      include: [
        {
          model: this.UserCoursesModel,
          as: 'userCourses',
          attributes: [], // don't include UserCourses fields in the result
          required: false, // left join to include courses with 0 students
        },
      ],
      group: ['CourseModel.id'],
    });

    const recentEnrollments = await this.UserCoursesModel.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: this.CourseModel,
          as: 'course',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    return {
      totalBuildings,
      totalCourses,
      totalFaculty,
      totalStudents,
      departmentOverview,
      recentEnrollments,
    };
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
