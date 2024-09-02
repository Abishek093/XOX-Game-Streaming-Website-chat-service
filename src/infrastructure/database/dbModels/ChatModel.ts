import mongoose, { Schema, model, Document, models } from "mongoose";



export interface IChatModel extends Document {
  _id?: mongoose.Types.ObjectId;
  users: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  is_blocked: boolean;
  is_accepted: 'pending' | 'accepted' | 'rejected';
}

const ChatSchema: Schema = new Schema<IChatModel>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    is_blocked: {
      type: Boolean,
      default: false,
    },
    is_accepted: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model<IChatModel>("ChatModel", ChatSchema);

export default ChatModel;