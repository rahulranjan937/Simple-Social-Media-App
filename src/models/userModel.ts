import mongoose from 'mongoose';

interface IUser {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  followers?: string[];
  following?: string[];
  verified?: boolean;
  resetPasswordToken?: string;
  resgisteredDate?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    avatar: {
      type: String,
      default: 'https://img.icons8.com/stickers/100/null/super-mario.png',
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: '',
    },
    resgisteredDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };
