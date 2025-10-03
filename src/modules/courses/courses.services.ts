// src/services/education.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CourseModel,
  SubjectModel,
  TimetableModel,
  UserCoursesModel,
} from 'src/modules/courses/courses.schema';
import {
  CreateCourseDto,
  CreateSubjectDto,
  CreateTimetableDto,
  UpdateCourseDto,
  UpdateSubjectDto,
  UpdateTimetableDto,
} from './courses.dto';
import { DbService } from 'src/core/services/db-service/db.service';

@Injectable()
export class CourseService {
  private readonly courseModel: typeof CourseModel;
  private readonly subjectModel: typeof SubjectModel;
  private readonly timetableModel: typeof TimetableModel;
  private readonly userCoursesModel: typeof UserCoursesModel;

  constructor(private readonly dbService: DbService) {
    this.courseModel = this.dbService.sqlService.CoursesModel;
    this.subjectModel = this.dbService.sqlService.SubjectModel;
    this.timetableModel = this.dbService.sqlService.TimetableModel;
    this.userCoursesModel = this.dbService.sqlService.UserCoursesModel;
  }

  // --- Course ---
  async createCourse(data: CreateCourseDto) {
    return await this.courseModel.create(data);
  }

  async getUserCourse(userId: string) {
    const enrolledInto = await this.userCoursesModel.findOne({
      where: { userId },
    });
    if (!enrolledInto) return null;
    const course = await this.courseModel.findByPk(
      enrolledInto.dataValues.courseId,
    );
    return course?.dataValues;
  }

  async joinCourse(userId: string, courseId: string) {
    const existingCourse = await this.getUserCourse(userId);
    if (existingCourse)
      throw new BadRequestException('Already enrolled in a course');
    return await this.userCoursesModel.create({
      userId,
      courseId,
    });
  }

  async getCourses() {
    return await this.courseModel.findAll();
  }

  async getCourse(id: string) {
    const course = await this.courseModel.findByPk(id);
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    return course;
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    const course = await this.getCourse(id);
    return course.update(data);
  }

  async deleteCourse(id: string) {
    const course = await this.getCourse(id);
    await course.destroy();
  }

  // --- Subject ---
  async createSubject(data: CreateSubjectDto) {
    return this.subjectModel.create(data);
  }

  async getSubjects() {
    return this.subjectModel.findAll();
  }

  async getSubject(id: string) {
    const subject = await this.subjectModel.findByPk(id);
    if (!subject)
      throw new NotFoundException(`Subject with id ${id} not found`);
    return subject;
  }

  async updateSubject(id: string, data: UpdateSubjectDto) {
    const subject = await this.getSubject(id);
    return subject.update(data);
  }

  async deleteSubject(id: string) {
    const subject = await this.getSubject(id);
    await subject.destroy();
  }

  // --- Timetable ---
  //

  async setCompleteTimetableForSubject(subjectId: string) {}
  async createTimetable(data: CreateTimetableDto) {
    return this.timetableModel.create(data);
  }

  async getTimetables() {
    return this.timetableModel.findAll();
  }

  async getTimetable(id: string) {
    const timetable = await this.timetableModel.findByPk(id);
    if (!timetable)
      throw new NotFoundException(`Timetable with id ${id} not found`);
    return timetable;
  }

  async updateTimetable(id: string, data: UpdateTimetableDto) {
    const timetable = await this.getTimetable(id);
    return timetable.update(data);
  }

  async deleteTimetable(id: string) {
    const timetable = await this.getTimetable(id);
    await timetable.destroy();
  }
}
