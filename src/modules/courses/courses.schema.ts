// src/models/education.model.ts

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { SqlModelsType } from 'src/core/services/db-service/db.types';

/* ==========================
   Course Model
========================== */
export class CourseModel extends Model<
  InferAttributes<CourseModel>,
  InferCreationAttributes<CourseModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare code: string;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  static setup(sequelize: Sequelize) {
    CourseModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'courses',
        modelName: 'CourseModel',
        timestamps: true,
      },
    );

    return CourseModel;
  }
}

export class UserCoursesModel extends Model<
  InferAttributes<UserCoursesModel>,
  InferCreationAttributes<UserCoursesModel>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare courseId: string;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  static setup(sequelize: Sequelize) {
    UserCoursesModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        courseId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'userCourses',
        modelName: 'UserCoursesModel',
        timestamps: true,
      },
    );

    return UserCoursesModel;
  }

  static associate(models: SqlModelsType) {
    UserCoursesModel.belongsTo(models.CoursesModel, {
      // Use correct model name
      foreignKey: 'courseId', // Correct foreign key
      as: 'course',
    });
  }
}

export class SubjectModel extends Model<
  InferAttributes<SubjectModel>,
  InferCreationAttributes<SubjectModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare teacherId: string;
  declare courseId: string;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  static setup(sequelize: Sequelize) {
    SubjectModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        courseId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        teacherId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'subjects',
        modelName: 'SubjectModel',
        timestamps: true,
      },
    );

    return SubjectModel;
  }

  static associate(models: SqlModelsType) {
    SubjectModel.belongsTo(models.CoursesModel, {
      // Use correct model name
      foreignKey: 'courseId', // Correct foreign key
      as: 'course',
    });

    SubjectModel.belongsTo(models.FacultyModel, {
      // Use correct model name
      foreignKey: 'teacherId', // Correct foreign key
      as: 'teacher',
    });
  }
}

/* ==========================
   Timetable Model
========================== */
// Define a Day enum
export enum Weekday {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
}

export class TimetableModel extends Model<
  InferAttributes<TimetableModel>,
  InferCreationAttributes<TimetableModel>
> {
  declare id: CreationOptional<string>;
  declare courseId: string;
  declare subjectId: string;
  declare day: Weekday;
  declare startTime: string; // Plain string like '09:00'
  declare endTime: string; // Plain string like '10:30'

  static setup(sequelize: Sequelize) {
    TimetableModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        courseId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        subjectId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        day: {
          type: DataTypes.ENUM(...Object.values(Weekday)),
          allowNull: false,
        },
        startTime: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        endTime: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'timetables',
        modelName: 'TimetableModel',
        timestamps: false,
      },
    );

    return TimetableModel;
  }

  static associate(models: SqlModelsType) {
    TimetableModel.belongsTo(models.SubjectModel, {
      foreignKey: 'subjectId',
      as: 'subject',
    });
    TimetableModel.belongsTo(models.CoursesModel, {
      foreignKey: 'courseId',
      as: 'course',
    });
  }
}
