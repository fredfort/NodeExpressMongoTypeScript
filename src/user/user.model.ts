import { Document, model, Schema } from 'mongoose';

interface IUser {
  created_date?: Date;
  email: string;
  name?: string;
  password: string;
}

const UserSchema = new Schema({
  created_date: {
    default: Date.now,
    type: Schema.Types.Date,
  },
  email: {
    required: true,
    type: Schema.Types.String,
    unique: true,
  },
  name: {
    type: Schema.Types.String,
  },
  password: {
    required: 'Enter a password',
    type: Schema.Types.String,
  },

});

export type UserType = (IUser & Document);

export default model<UserType>('users', UserSchema);
