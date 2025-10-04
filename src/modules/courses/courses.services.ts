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
  Weekday,
} from 'src/modules/courses/courses.schema';
import {
  CreateCompleteTimetableDto,
  CreateCourseDto,
  CreateSubjectDto,
  CreateTimetableDto,
  UpdateCourseDto,
  UpdateSubjectDto,
  UpdateTimetableDto,
} from './courses.dto';
import { DbService } from 'src/core/services/db-service/db.service';
import { FacultyModel } from '../faculty/faculty.schema';

@Injectable()
export class CourseService {
  private readonly courseModel: typeof CourseModel;
  private readonly subjectModel: typeof SubjectModel;
  private readonly timetableModel: typeof TimetableModel;
  private readonly userCoursesModel: typeof UserCoursesModel;
  private readonly facultyModel: typeof FacultyModel;

  constructor(private readonly dbService: DbService) {
    this.courseModel = this.dbService.sqlService.CoursesModel;
    this.subjectModel = this.dbService.sqlService.SubjectModel;
    this.timetableModel = this.dbService.sqlService.TimetableModel;
    this.userCoursesModel = this.dbService.sqlService.UserCoursesModel;
    this.facultyModel = this.dbService.sqlService.FacultyModel;
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
    const subject = await this.subjectModel.create(data);
    await this.setCompleteTimetableForSubject({
      subjectId: subject.dataValues.id,
      timetables: data.timetables,
    });
    return subject.dataValues;
  }

  async getSubjects(courseId?: string) {
    const whereClause = courseId ? { courseId } : undefined;

    return await this.subjectModel.findAll({
      where: whereClause,
      include: [
        {
          association: 'timetables',
        },
      ],
    });
  }

  async getSubject(id: string) {
    const subject = await this.subjectModel.findByPk(id);
    if (!subject)
      throw new NotFoundException(`Subject with id ${id} not found`);
    return subject;
  }

  async updateSubject(id: string, data: UpdateSubjectDto) {
    const subject = await this.getSubject(id);
    await this.setCompleteTimetableForSubject({
      subjectId: id,
      timetables: data.timetables,
    });
    return subject.update(data);
  }

  async deleteSubject(id: string) {
    const subject = await this.getSubject(id);
    await subject.destroy();
  }

  // --- Timetable ---
  //

  async setCompleteTimetableForSubject(data: CreateCompleteTimetableDto) {
    await this.timetableModel.destroy({ where: { subjectId: data.subjectId } });

    //TODO
    const subject = await this.getSubject(data.subjectId);
    const created = await Promise.all(
      data?.timetables?.map((t) =>
        this.timetableModel.create({
          courseId: subject.dataValues.courseId,
          subjectId: data.subjectId,
          day: t.day,
          startTime: t.startTime,
          endTime: t.endTime,
          room: t.room,
        }),
      ),
    );

    return created;
  }
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

  async getCourseTimetable(userId: string) {
    const course = await this.getUserCourse(userId);

    const timetables: any = await this.timetableModel.findAll({
      where: { courseId: course?.id },
      include: [
        {
          model: SubjectModel,
          as: 'subject',
          attributes: ['id', 'name', 'teacherId'],
          include: [
            {
              model: this.facultyModel, // << This should be FacultyModel
              as: 'teacher',
              attributes: ['id', 'name', 'email', 'designation'],
            },
          ],
        },
      ],
      order: [
        ['day', 'ASC'],
        ['startTime', 'ASC'],
      ],
    });

    // Group by day
    const grouped: Record<Weekday, any[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    for (const entry of timetables) {
      grouped[entry.day].push({
        subject: {
          id: entry.subject?.id,
          name: entry.subject?.name,
        },
        faculty: entry.subject?.teacher
          ? {
              id: entry.subject.teacher.id,
              name: entry.subject.teacher.name,
              email: entry.subject.teacher.email,
              designation: entry.subject.teacher.designation,
            }
          : null,
        course,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
      });
    }

    return grouped;
  }
}
