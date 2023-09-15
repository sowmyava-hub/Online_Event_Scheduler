import { Dispatch } from "react";
import { Table } from "react-bootstrap";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import MarkTimes from "./MarkTimes";
import PollDateTime from "./PollDateTime";
import { Time, PollFromDB, Vote } from "../../models/poll";
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
import React from 'react';
import moment from 'moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import 'moment-timezone';


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

dayjs.extend(localizedFormat);
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


const PollTableVoter = (props: {
  pollFromDB: PollFromDB;
  sortedTimes: Time[];
  newVote: Vote;
  setNewVote: Dispatch<Vote>;
}): JSX.Element => {
  const { pollFromDB, sortedTimes, newVote, setNewVote } = props;
  console.log(newVote);
  console.log("check");
  console.log(setNewVote);
  const InitialTz = 'America/New_York';
  const currentDate = new Date();
  const InitialDate = currentDate.toISOString();
  const classes = useStyles();
  //const time_obj = [];
  const [tz, setTz] = React.useState(InitialTz);
  const [date, setDate] = React.useState(moment(InitialDate).tz(InitialTz));
  const [time_obj, setTime_obj] = React.useState([]);
  const updated_sortedtimes = {};
  const handleTimezoneChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const timezone = event.target.value as string;
    setTz(timezone);
    UserProfile.setTimezone(timezone);
    setDate(moment(date).tz(timezone));

    // sortedTimes.forEach(function (item, index) {
    //   const fromdate = moment(new Date(item.start)).tz(timezone);
    //   const todate = moment(new Date(item.end)).tz(timezone);
    //   setTime_obj[index] = {};
    //   setTime_obj[index].fromdate = fromdate.format("hh:mm A");
    //   setTime_obj[index].enddate = todate.format("hh:mm A");

    // })

    const updatedTimeObj = sortedTimes.map((item) => {
      const fromdate = moment(new Date(item.start)).tz(timezone);
      const todate = moment(new Date(item.end)).tz(timezone);
      return { fromdate: fromdate.format("hh:mm A"), todate: todate.format("hh:mm A") };
    });
    setTime_obj(updatedTimeObj);
  };

  // const groupByCategory = sortedTimes.groupBy(product => {
  //   return dayjs(product.start).format("ddd");
  // });
  // console.log(groupByCategory);

  sortedTimes.forEach(function (item) {
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

  const handleDateTimeChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      console.log(`${date.format('YYYY-MM-DD hh:mm A')} ${date.tz()}`);
      setDate(date);
    }
  };


  return (
    <div>
      <Col sm style={{ top: "0px" }}>
        {/* <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <CssBaseline />
            <HomePage />
          </MuiPickersUtilsProvider >
        </ThemeProvider> */}

        <Box p={2}>
          <Typography component="h3" variant="h5">
          </Typography>

          <FormControl className={classes.formControl}>
            <InputLabel id="timezone-label">Timezone</InputLabel>
            <Select
              labelId="timezone-label"
              id="timezone-select"
              value={tz}
              onChange={handleTimezoneChange}
            >
              {moment.tz.names().map(name => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography component="h2" variant="h6" className={classes.result}>
          </Typography>
          {/* <Typography>
            {date.format(' hh:mm A')} {date.tz()}
          </Typography> */}
        </Box>

      </Col>

      <Table responsive>
        <thead>
          <tr>
            {sortedTimes.map((time, index) => (
              <th key={time.start} className="poll-slot-time">
                <PollDateTime time={time} start={time_obj[index] ? time_obj[index].fromdate : "0"} end={time_obj[index] ? time_obj[index].todate : "0"} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pollFromDB.open && (
            <MarkTimes
              times={sortedTimes}
              newVote={newVote}
              setNewVote={setNewVote}
            />
          )}
        </tbody>
      </Table>



      {/* <Table responsive>
        <thead>
         
          {rows.map((row, index) => (
            <tr key={index}>
              {keys.map((key) => (
                <th key={key}>
                  <PollDateTime time={row[key]} start={time_obj[index] ? time_obj[index].fromdate : "0"} end={time_obj[index] ? time_obj[index].todate : "0"} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
       
        {pollFromDB.open && (
          <MarkTimes
            times={sortedTimes}
            newVote={newVote}
            setNewVote={setNewVote}
          />
        )}
        
      </Table> */}

    </div>
  );
};

export default PollTableVoter;
