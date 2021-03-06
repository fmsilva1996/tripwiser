import mongoose from '../connect';
import { Document } from 'mongoose';
import { ITrip } from './trip.model';

const Schema = mongoose.Schema;

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  trips?: ITrip['_id'][];
  token?: string;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    trips: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
