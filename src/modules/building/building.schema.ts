import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  Sequelize,
} from 'sequelize';

export class BuildingModel extends Model<
  InferAttributes<BuildingModel>,
  InferCreationAttributes<BuildingModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare latitude: number;
  declare longitude: number;
  declare description: string | null;

  static setup(sequelize: Sequelize) {
    BuildingModel.init(
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
        latitude: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        longitude: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'buildings',
        modelName: 'BuildingModel',
        timestamps: false,
      },
    );

    return BuildingModel;
  }
}
