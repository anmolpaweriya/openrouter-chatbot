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

export class SubjectModel extends Model<
  InferAttributes<SubjectModel>,
  InferCreationAttributes<SubjectModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
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
  }
}

/* ==========================
   Timetable Model
========================== */
export class TimetableModel extends Model<
  InferAttributes<TimetableModel>,
  InferCreationAttributes<TimetableModel>
> {
  declare id: CreationOptional<string>;
  declare courseId: string;
  declare subjectId: string;
  declare day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  declare timeSlot: string; // e.g., '09:00', '10:00', etc.

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
          type: DataTypes.ENUM(
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
          ),
          allowNull: false,
        },
        timeSlot: {
          type: DataTypes.STRING,
          allowNull: false, // Format '09:00', '10:00', ...
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
      // Should be TimetableModel, not SubjectModel
      foreignKey: 'subjectId', // Use subjectId foreign key
      as: 'subject',
    });
    TimetableModel.belongsTo(models.CoursesModel, {
      foreignKey: 'courseId',
      as: 'course',
    });
  }
}
