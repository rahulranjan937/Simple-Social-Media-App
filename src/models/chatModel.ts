import mongoose from 'mongoose';

interface IChat {
  _id?: string;
  user?: string;
  chatName: string;
  isGroupChat?: Date;
  latestMessage?: string;
  groupAdmin?: string;
  members?: string[];
  date?: Date;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    chatName: {
      type: String,
      trim: true,
      required: [true, 'Chat name is required'],
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model<IChat>('Chat', chatSchema);

export { Chat, IChat };
