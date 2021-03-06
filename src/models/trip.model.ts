import mongoose from '../connect';
import { Document, Model } from 'mongoose';
import User, { IUser } from './user.model';
import { IFlight } from './flight.model';
import { IPlace } from './place.model';
import { environment } from '../environment';
import { sendSMS } from '../twilio';
import startOfDay from 'date-fns/startOfDay';

const Schema = mongoose.Schema;

export interface ITrip extends Document {
  creator: string; // User ID as Reference
  booked: boolean;
  startLocation: IPlace['_id'];
  endLocation: IPlace['_id'];
  startDate: Date;
  destinations: IPlace['_id'];
  flights: IFlight['_id'];
  currency: string;
  price: number;
  createdAt?: Date;
}

interface TripStaticModel extends Model<ITrip> {
  sendSMSReminder(): Promise<any>;
}

const TripSchema = new Schema(
  {
    creator: {
      type: String,
      required: true,
    },
    booked: {
      type: Boolean,
      required: true,
    },
    startLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
    },

    endLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    destinations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Place',
      },
    ],
    flights: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Flight',
      },
    ],
    currency: String,
    price: Number,
  },
  { timestamps: true }
);

TripSchema.statics.sendSMSReminder = async function () {
  const dayold = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate()-5)
  const tripsReminded = await Trip.find({
    createdAt: {$lte: new Date(), $gte: dayold },
  });
  let ids: string[] = [];
  if (tripsReminded.length === 0) {
    console.log('no trips');
    return;
  }
  tripsReminded.forEach((trip) => {
    if (ids.includes(trip.creator)) return;
    ids = [...ids, trip.creator];
    return;
  });
  const users = await User.find({ _id: { $in: ids } });
  sendToUsers(users);
  return;
};

const sendToUsers = (users: IUser[]) => {
  users.forEach((user) => {
    if (!user.phoneNumber) return;
    const option = {
      to: user.phoneNumber,
      from: environment.twilio.phoneNumber,
      body: `Hello ${user.firstName} from tripWiser you still have open trips in you wishlist`,
    };
    sendSMS(option);
    return;
  });
};

const Trip = mongoose.model<ITrip, TripStaticModel>('Trip', TripSchema);
export default Trip;
