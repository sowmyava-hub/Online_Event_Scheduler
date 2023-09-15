import { Dispatch } from "react";
import { Table } from "react-bootstrap";
import dayjs from "dayjs";

import MarkTimes from "./MarkTimes";
import { Time, PollFromDB, Vote, Recevent } from "../../models/poll";
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HomePage } from "./calendarcomp2";
import { theme } from "./theme";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import moment from 'moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import 'moment-timezone';
import { ScheduleMeeting } from 'react-schedule-meeting';
import { ToastContainer, toast } from "react-toastify";


import {
  Row,
  Col,
  Form,
  Container,
  Jumbotron,
  Button,
  Spinner,
} from "react-bootstrap";
import UserProfile from '../../../pages/session';
import { Console } from "console";
import toastOptions from "../../helpers/toastOptions";


const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 220
  },
  dateTimePicker: {
    width: 220
  },
  result: {
    marginTop: theme.spacing(4)
  }
}));


const MeetingTableVoter = (props: {
  pollFromDB: PollFromDB;
  sortedTimes: Time[];
  newVote: Recevent;
  setNewVote: Dispatch<Recevent>;
}): JSX.Element => {
  const { pollFromDB, sortedTimes, newVote, setNewVote } = props;
  // console.log(newVote);
  // console.log("check");
  // console.log(setNewVote);

  // const availableTimeSlots = [];
  const recurrEventsStringArray = pollFromDB.recurr_event.map(event => JSON.stringify(event));
  const firstRecurrEventString = recurrEventsStringArray[0];
  const firstRecurrEventObject = JSON.parse(firstRecurrEventString);
  const firstEventId = firstRecurrEventObject.event_id;
  const firstTitle = firstRecurrEventObject.title;


  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<any[]>([]);

  const [dbData, setDbData] = React.useState<any>([]);

  React.useEffect(() => {
    const localAvailableTimeSlots = [];

    pollFromDB.recurr_event.filter((event) => event.status === 0).forEach((event) => {
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);

      startTime.setHours(startTime.getHours());
      endTime.setHours(endTime.getHours());

      localAvailableTimeSlots.push({ startTime, endTime });
    });
    setAvailableTimeSlots(localAvailableTimeSlots);

    const updatedEvents = pollFromDB.recurr_event.map((event: any) => {
      return {
        ...event,
        "event_id": event["event_id"],
        "title": event.title,
        "status": event.status,
      }
    });
    setDbData(updatedEvents);

  }, []);




  const handleStartTimeSelect = (selectedTimeSlot) => {
    // console.log('selectedTimeSlot:', selectedTimeSlot);
    // console.log('selectedTimeSlot:', selectedTimeSlot.startTime);
    // console.log('selectedTimeSlot:', selectedTimeSlot.endTime);

    // const startTimestamp = new Date(selectedTimeSlot.availableTimeslot.startTime).getTime();
    // const endTimestamp = new Date(selectedTimeSlot.availableTimeslot.endTime).getTime();
    // "2023-04-19T09:00:00.000Z"
    // if (name.trim.length == 0) {
    //   toast.error("Please enter your name before choosing slots", toastOptions);
    //   return;
    // }

    const startTimestamp = new Date(selectedTimeSlot.startTime);
    startTimestamp.setHours(startTimestamp.getHours());

    console.log(startTimestamp);
    console.log(dbData);
    const updatedArrayWithStatus = [...dbData].map((event) => {
      const startTime = new Date(event.start);
      const endTime = new Date(event.end);

      if (startTime.getTime() === startTimestamp.getTime()) {
        let updatedEvent = {

          ...event,
          status: 1,
          color: "green",
          title: name,
        }

        return updatedEvent;
      }
      return event;

    });
    // const updatedarray = pollFromDB.recurr_event;
    // const finalTime = {
    //   start: startTimestamp,
    //   end: endTimestamp
    // };

    // console.log('finalTime:', finalTime);
    console.log('Updated Recurr Events:', updatedArrayWithStatus);

    setNewVote({ recurr_event: updatedArrayWithStatus as [] });
  };

  const [name, setName] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setName(value);
    localStorage.setItem(
      "Meeting_data",
      JSON.stringify(value)
    );
  };

  return (
    <div>
      <Form.Control
        className="voter-page-poll-mark-time-name"
        type="text"
        maxLength={30}
        placeholder="Your name"
        onChange={handleNameChange}
        autoFocus
      />
      <br></br>
      {name.length == 0 ? <p>Please enter your name to view slots</p> :
        <ScheduleMeeting
          borderRadius={10}
          primaryColor="green"
          eventDurationInMinutes={15}
          availableTimeslots={availableTimeSlots}
          onStartTimeSelect={handleStartTimeSelect}
        />
      }


    </div>
  );
};

export default MeetingTableVoter;
