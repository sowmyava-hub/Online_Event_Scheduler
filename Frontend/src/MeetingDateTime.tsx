import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Time } from "../../models/poll";
import { ScheduleMeeting } from 'react-schedule-meeting';
dayjs.extend(localizedFormat);

// const PollDateTime = (props: { time: Time }): JSX.Element => {
//   const { time } = props;
//   return (
//     <div>
//       <span className="datetime-weekday">
//         {dayjs(time.start).format("ddd")}
//       </span>
//       <span className="datetime-day">{dayjs(time.start).format("D")}</span>
//       <span className="datetime-mon">{dayjs(time.start).format("MMM")}</span>
//       <span className="datetime-time-1">{dayjs(time.start).format("LT")}</span>
//       <span className="datetime-time-2">{dayjs(time.end).format("LT")}</span>
//     </div>
//   );
// };

const availableTimeSlots = [
  {
    startTime: new Date('2023-04-15T10:30:00.000Z'),
    endTime: new Date('2023-04-15T11:00:00.000Z'),
  },
  {
    startTime: new Date('2023-04-15T11:30:00.000Z'),
    endTime: new Date('2023-04-15T12:00:00.000Z'),
  },
];

const handleStartTimeSelect = (selectedStartTime) => {
  console.log(`Selected start time: ${JSON.stringify(selectedStartTime)}`);
}

const MeetingDateTime = (): JSX.Element => {
  return (
    <ScheduleMeeting
      borderRadius={10}
      primaryColor="green"
      eventDurationInMinutes={30}
      availableTimeslots={availableTimeSlots}
      onStartTimeSelect={handleStartTimeSelect}
    />
  );
};

export default MeetingDateTime;
