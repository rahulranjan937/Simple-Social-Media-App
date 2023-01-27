import mongoose from 'mongoose';

interface IPost {
  _id?: string;
  user?: string;
  caption: string;
  imageUrls: string[];
  likes?: string[];
  comments?: string[];
  date?: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    caption: {
      type: String,
      required: [true, 'Caption is required'],
    },
    imageUrls: [
      {
        type: String,
        required: [true, 'Image URLs is required'],
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, versionKey: false }
);

const Post = mongoose.model<IPost>('Post', postSchema);

export { Post, IPost };
