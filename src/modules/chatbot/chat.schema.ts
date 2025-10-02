// src/models/chat-history.model.ts
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class ChatHistoryModel extends Model<
  InferAttributes<ChatHistoryModel>,
  InferCreationAttributes<ChatHistoryModel>
> {
  declare id: CreationOptional<string>;
  declare sessionId: string;
  declare role: 'user' | 'assistant' | 'system';
  declare content: string;
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
        sessionId: {
          type: DataTypes.STRING,
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
        tableName: 'chat_histories',
        modelName: 'ChatHistoryModel',
        timestamps: true,
      },
    );

    return ChatHistoryModel;
  }
}
