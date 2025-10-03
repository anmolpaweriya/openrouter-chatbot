import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
} from 'sequelize';
import { SqlModelsType } from 'src/core/services/db-service/db.types';

export class FacultyModel extends Model<
  InferAttributes<FacultyModel>,
  InferCreationAttributes<FacultyModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare phone: string;
  declare email: string;

  static setup(sequelize: Sequelize) {
    FacultyModel.init(
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
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'faculties',
        modelName: 'FacultyModel',
        timestamps: false,
      },
    );

    return FacultyModel;
  }

  static associate(models: SqlModelsType) {
    // Add associations later if needed
    // e.g., FacultyModel.hasMany(models.SubjectModel, { ... })
  }
}
