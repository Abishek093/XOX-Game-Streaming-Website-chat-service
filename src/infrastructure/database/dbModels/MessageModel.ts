import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  _id?: mongoose.Types.ObjectId;
  chatId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content?: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'pdf' | 'gif';
    url: string;
  }[];
  repliedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatModel',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video', 'audio', 'pdf', 'gif'],
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
