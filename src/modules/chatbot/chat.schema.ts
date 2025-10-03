// src/models/chat-history.model.ts
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { SqlModelsType } from 'src/core/services/db-service/db.types';

export class ChatHistoryModel extends Model<
  InferAttributes<ChatHistoryModel>,
  InferCreationAttributes<ChatHistoryModel>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare userId: string;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  static setup(sequelize: Sequelize) {
    ChatHistoryModel.init(
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
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'chat_histories',
        modelName: 'ChatHistoryModel',
        timestamps: true,
      },
    );

    return ChatHistoryModel;
  }

  static associate(models: SqlModelsType) {
    ChatHistoryModel.hasMany(models.ChatMessageModel, {
      foreignKey: 'chatId',
      as: 'messages',
      onDelete: 'CASCADE',
    });
  }
}

export class ChatMessageModel extends Model<
  InferAttributes<ChatMessageModel>,
  InferCreationAttributes<ChatMessageModel>
> {
  declare id: CreationOptional<string>;
  declare chatId: string;
  declare role: 'user' | 'assistant' | 'system';
  declare content: string;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  static setup(sequelize: Sequelize) {
    ChatMessageModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        chatId: {
          type: DataTypes.UUID, // Changed to UUID to match ChatHistoryModel.id
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('user', 'assistant', 'system'),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'chat_messages', // Changed to different table name
        modelName: 'ChatMessageModel', // Corrected model name
        timestamps: true,
      },
    );

    return ChatMessageModel;
  }

  static associate(models: SqlModelsType) {
    ChatMessageModel.belongsTo(models.ChatHistoryModel, {
      foreignKey: 'chatId',
      as: 'chat',
      onDelete: 'CASCADE',
    });
  }
}
