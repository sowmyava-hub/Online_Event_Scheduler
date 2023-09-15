import mongoose, { model, Model, Document, Schema } from "mongoose";

export interface Time {
  start: number;
  end: number;
  ifNeedBe?: boolean;
}

export interface TimeFromDB {
  _id: string;
  start: number;
  end: number;
  ifNeedBe?: boolean;
}

export interface RecurFromDB {
  event_id: string;
  title: string;
  start: string;
  end: string;
  _id: string;
}

export interface Vote {
  name: string;
  times: Time[];
}

export interface Recevent {
  recurr_event: [];
}
export interface VoteFromDB {
  _id: string;
  name: string;
  times: TimeFromDB[];
}

export interface Poll {
  title?: string;
  description?: string;
  open?: boolean;
  secret: string;
  location?: string;
  times: Time[];
  finalTime?: Time;
  votes?: Vote[];
  endate: string;
  recurr: string;
  userid: string;
  recurr_endate: string;
  recurr_event: [];
}

export interface PollFromDB {
  _id: string;
  title?: string;
  description?: string;
  open?: boolean;
  secret: string;
  location?: string;
  times: TimeFromDB[];
  finalTime?: TimeFromDB;
  votes?: VoteFromDB[];
  createdAt: string;
  updatedAt: string;
  endate: string;
  recurr_endate: string;
  recurr_event: [];
  recurr: string;
  userid: string;
  __v: number;
}

export interface PollDoc extends Document {
  title?: string;
  description?: string;
  open?: boolean;
  secret: string;
  location?: string;
  times: Time[];
  finalTime?: Time;
  votes?: Vote[];
  recurr_event: [];
}

const PollSchema: Schema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    open: { type: Boolean, default: true },
    secret: { type: String, required: true },
    location: { type: String },
    endate: { type: String },
    recurr_endate: { type: String },
    recurr: { type: String },
    userid: { type: String },
    times: {
      type: [{ start: Number, end: Number }],
      required: true,
    },
    finalTime: { type: { start: Number, end: Number } },
    votes: [
      {
        name: String,
        times: [{ start: Number, end: Number, ifNeedBe: Boolean }],
      },
    ],
    recurr_event: [{
      event_id: Number,
      title: String,
      start: Date,
      end: Date,
      status: Number,
      color: String


    }]
  },
  { timestamps: true }
);

const OesPoll: Model<PollDoc> =
  mongoose.models.Poll || model("Poll", PollSchema);

export interface HttpResponse {
  data: any;
  statusCode: number;
}

export default OesPoll;
