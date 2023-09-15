import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Time } from "../../models/poll";
import React from 'react';
import moment from 'moment';
import UserProfile from '../../../pages/session';
import timezone from "dayjs/plugin/timezone";
import 'moment-timezone';


const timezone_val = UserProfile.getTimezone() ? UserProfile.getTimezone() : 'America/New_York';
// const InitialTz = 'America/New_York';
// const InitialDate = '2020-01-01T09:00:00-05:00';
dayjs.extend(localizedFormat);
// dayjs.extend(timezone);
const PollDateTime = (props: { time: Time, start: String, end: String }): JSX.Element => {
  const { time, start, end } = props;
  //console.log(zone);
  const fromdate = moment(new Date(time.start)).tz(timezone_val);
  const todate = moment(new Date(time.end)).tz(timezone_val);
  //console.log(`${moment(time.start).tz(timezone_val).format('YYYY-MM-DD hh:mm A')}${time.start.tz()}`);
  // const [tz, setTz] = React.useState(timezone_val);
  // const [date, setDate] = React.useState(moment(InitialDate).tz(InitialTz));
  // setDate(moment(time.start).tz(timezone_val));
  return (
    <div>
      <span className="datetime-weekday">
        {dayjs(time.start).format("ddd")}
      </span>
      <span className="datetime-day">{dayjs(time.start).format("D")}</span>
      <span className="datetime-mon">{dayjs(time.start).format("MMM")}</span>

      {/* <span className="datetime-time-1">{dayjs(time.start).format("LT")}</span> */}
      <span className="datetime-time-1">{start != "0" ? start : fromdate.format("hh:mm A")}</span>
      <span className="datetime-time-2">{end != "0" ? end : todate.format("hh:mm A")}</span>
    </div>
  );
};

export default PollDateTime;
