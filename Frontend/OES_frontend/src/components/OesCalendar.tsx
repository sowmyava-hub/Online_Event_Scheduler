import { Calendar, Views, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import { Time } from "../models/poll";
import React, { useState } from 'react';


const localizer = dayjsLocalizer(dayjs);

const OesCalendar = (props: { pollTimes; setTimes; recurr }): JSX.Element => {
  const { pollTimes, setTimes, recurr } = props;
  const [defaultview, setdefaultview] = useState(Views.WEEK);
  const [weekview, setWeekView] = useState(true);
  //setdefaultview(Views.WEEK);
  let viewval = 0;
  let hide = false;
  if (pollTimes.length > 0 && (recurr == "Weekly" || recurr == "Daily")) {
    hide = true;
  } else {
    hide = false;
  }

  const handleViewChange = (newView) => {
    // Handle view change event
    if (defaultview !== newView) {
      setdefaultview(newView);
    }

  }

  if (recurr == "Daily") {
    handleViewChange(Views.DAY);
    //setWeekView(false);
    viewval = 1;
  } else if (recurr == "Monthly") {
    handleViewChange(Views.MONTH);
    //setWeekView(true);
    viewval = 2;
  } else {
    viewval = 0;
  }

  const onTimesChange = ({ start, end }): void => {
    const newTime: Time = {
      start: start.getTime(),
      end: end.getTime(),
    };

    setTimes([...pollTimes, newTime]);
  };

  const onTimeRemove = ({ start, end }): void => {
    const newPollTimes = pollTimes.filter(
      (time) => !(time.start === start.getTime() && time.end === end.getTime())
    );

    setTimes([...newPollTimes]);
  };

  return (
    <>
      {viewval == 0 && < Calendar
        defaultView={Views.WEEK}
        events={
          pollTimes.map((time) => ({
            start: new Date(time.start),
            end: new Date(time.end),
          }))
        }
        localizer={localizer}
        onSelectSlot={onTimesChange}
        onSelectEvent={onTimeRemove}
        step={15}
        views={["week", "day", "month"]}
        onView={handleViewChange}
        toolbar={hide ? false : true}
        selectable
      />}
      {viewval == 1 && < Calendar
        defaultView={Views.DAY}
        events={
          pollTimes.map((time) => ({
            start: new Date(time.start),
            end: new Date(time.end),
          }))
        }
        localizer={localizer}
        onSelectSlot={onTimesChange}
        onSelectEvent={onTimeRemove}
        step={15}
        views={["week", "day", "month"]}
        onView={handleViewChange}
        toolbar={hide ? false : true}
        selectable
      />}

      {viewval == 2 && < Calendar
        defaultView={Views.MONTH}
        events={
          pollTimes.map((time) => ({
            start: new Date(time.start),
            end: new Date(time.end),
          }))
        }
        localizer={localizer}
        onSelectSlot={onTimesChange}
        onSelectEvent={onTimeRemove}
        step={15}
        views={["week", "day", "month"]}
        onView={handleViewChange}
        selectable
      />}
    </>


  );



};

export default OesCalendar;
