import { Dispatch, useState } from "react";
import { CheckCircleFill, CircleFill } from "react-bootstrap-icons";
import { Time, Vote } from "../../models/poll";
import dayjs from "dayjs";

const MarkTimes = (props: {
  times: Time[];
  newVote: Vote;
  setNewVote: Dispatch<Vote>;
}): JSX.Element => {
  const { times, newVote, setNewVote } = props;
  const updated_sortedtimes = {};
  times.forEach(function (item) {
    const date_str = dayjs(item.start).format("D");
    if (updated_sortedtimes[date_str] && updated_sortedtimes[date_str].length > 0) {
      updated_sortedtimes[date_str].push(item);
    } else {
      updated_sortedtimes[date_str] = [];
      updated_sortedtimes[date_str].push(item);
    }

  });
  console.log(updated_sortedtimes);

  const keys = Object.keys(updated_sortedtimes);

  // Determine the length of the longest array in arrOfObjects
  const maxLength = keys.reduce((max, key) => {
    const arrayLength = updated_sortedtimes[key].length;
    return arrayLength > max ? arrayLength : max;
  }, 0);

  // Create an array of objects where each object has properties for each array index
  const rows = Array(maxLength).fill(null).map((_, index) => {
    const row = {};
    keys.forEach((key) => {
      row[key] = updated_sortedtimes[key][index] || {};
    });
    return row;
  });

  console.log(rows);

  const [timeBoxStatus, setTimeBoxStatus] = useState<Record<number, number>>(
    times.reduce((obj, cur) => ({ ...obj, [cur.start]: 0 }), {})
  );

  const statusValues = ["no", "yes", "if-need-be"];

  const handleMarkTimeBoxClick = (e: React.MouseEvent<HTMLElement>): void => {
    if (e.target !== e.currentTarget) return;
    const time = JSON.parse((e.target as HTMLElement).id);

    const newTimeBoxStatus = (timeBoxStatus[time.start] + 1) % 3;
    setTimeBoxStatus((prev) => ({ ...prev, [time.start]: newTimeBoxStatus }));

    let newTimes = newVote.times;

    if (newTimeBoxStatus === 1) {
      // yes
      newTimes = newTimes.filter((item) => item.start !== time.start);
      newTimes.push(time);
      setNewVote({ name: newVote.name, times: newTimes });
    } else if (newTimeBoxStatus === 2) {
      // if-need-be
      newTimes = newTimes.filter((item) => item.start !== time.start);
      time.ifNeedBe = true;
      newTimes.push(time);
      setNewVote({ name: newVote.name, times: newTimes });
    } else {
      // no
      newTimes = newTimes.filter((item) => item.start !== time.start);
      setNewVote({ name: newVote.name, times: newTimes });
    }
  };

  return (
    <tr>
      {times.map((time) => (
        <td key={time.start} className="poll-mark-time-cell">
          <div
            className={`poll-mark-time-box ${statusValues[timeBoxStatus[time.start]]
              }`}
            id={JSON.stringify(time)}
            aria-hidden="true"
            onClick={handleMarkTimeBoxClick}
          >
            {timeBoxStatus[time.start] === 1 && (
              <CheckCircleFill className="poll-mark-time-box-check yes" />
            )}
            {timeBoxStatus[time.start] === 2 && (
              <CircleFill className="poll-mark-time-box-check if-need-be" />
            )}
          </div>
        </td>
      ))}
    </tr>
    // <tbody>
    //   {
    //     rows.map((row, index) => (
    //       <tr key={index}>
    //         {keys.map((key) => (
    //           <td key={row[key].start} className="poll-mark-time-cell">
    //             <div
    //               className={`poll-mark-time-box ${statusValues[timeBoxStatus[row[key].start]]
    //                 }`}
    //               id={JSON.stringify(row[key])}
    //               aria-hidden="true"
    //               onClick={handleMarkTimeBoxClick}
    //             >
    //               {timeBoxStatus[row[key].start] === 1 && (
    //                 <CheckCircleFill className="poll-mark-time-box-check yes" />
    //               )}
    //               {timeBoxStatus[row[key].start] === 2 && (
    //                 <CircleFill className="poll-mark-time-box-check if-need-be" />
    //               )}
    //             </div>
    //           </td>
    //         ))}
    //       </tr>
    //     ))
    //   }
    // </tbody>

  );
};

export default MarkTimes;
