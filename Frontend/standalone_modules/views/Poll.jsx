import React, { useState, useEffect } from 'react';
import { format, formatISO, eachMinuteOfInterval } from 'date-fns';
import { Row, Col, Form, Button} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import DayPicker, { DateUtils } from 'react-day-picker';
import WeekDayPicker from '../components/WeekDayPicker';
import Layout from './Layout';
import axios from 'axios';
import { useHistory } from 'react-router';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const aryIannaTimeZones = [
  'Europe/Andorra',
  'America/Jamaica',
  'Asia/Amman',
  'Asia/Tokyo',
  'Africa/Nairobi',
  'Asia/Bishkek',
  'Pacific/Tarawa',
  'Pacific/Enderbury',
  'Pacific/Kiritimati',
  'Asia/Pyongyang',
  'Asia/Seoul',
  'Asia/Almaty',
  'Asia/Qyzylorda',
  'Asia/Qostanay', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
  'Asia/Aqtobe',
  'Asia/Aqtau',
  'Asia/Atyrau',
  'Asia/Oral',
  'Asia/Beirut',
  'Asia/Colombo',
  'America/Mexico_City',
  'Asia/Kuala_Lumpur',
  'Asia/Kuching',
  'Asia/Kamchatka',
  'Asia/Anadyr',
  'Asia/Riyadh',
  'Europe/Zaporozhye',
  'Pacific/Wake',
  'America/New_York',
  'America/Detroit',
  'America/Chicago',
  'America/Indiana/Tell_City',
  'America/Indiana/Knox',
  'America/Menominee',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Sitka',
  'America/Yakutat',
  'America/Nome',
  'America/Adak'
];
const dayHours = [
  [0, '12:00 am'],
  [1, '01:00 am'],
  [2, '02:00 am'],
  [3, '03:00 am'],
  [4, '04:00 am'],
  [5, '05:00 am'],
  [6, '06:00 am'],
  [7, '07:00 am'],
  [8, '08:00 am'],
  [9, '09:00 am'],
  [10, '10:00 am'],
  [11, '11:00 am'],
  [12, '12:00 pm'],
  [13, '01:00 pm'],
  [14, '02:00 pm'],
  [15, '03:00 pm'],
  [16, '04:00 pm'],
  [17, '05:00 pm'],
  [18, '06:00 pm'],
  [19, '07:00 pm'],
  [20, '08:00 pm'],
  [21, '09:00 pm'],
  [22, '10:00 pm'],
  [23, '11:00 pm'],
];

/**
 * Calculates the surrounding 15 days after the user current day for the options of the survey end day
 * @returns An array with two arrays: one for the days in ISO 8601 format and another one with the days formatted like 'April, Monday 1st'
 */
function getSurveyEndDays() {
  let todayInMillis = new Date().getTime();
  let surveyEndDaysISO = [];
  let surveyEndDaysFormatted = [];

  [...Array(15)].map(() => {
    todayInMillis += 86400000;

    // Here you can see the date-fns format options for the dates: https://date-fns.org/v2.21.1/docs/format
    surveyEndDaysISO.push(formatISO(new Date(todayInMillis)));
    surveyEndDaysFormatted.push(
      format(new Date(todayInMillis), 'EEEE, MMMM do')
    );
  });

  return [surveyEndDaysISO, surveyEndDaysFormatted];
}

/**
 * This method was created with the eachMinuteOfInterval() function in date-fns library to easily get the hour intervals between the selected hours by the user
 * @param {*} interval Steps the schedule going to follow
 * @param {*} from_slot1 The initial hour of the event
 * @param {*} to_slot1  The finish hour of the event
 * @returns An array with the current steps intervals and parsed hour format
 */
function setTimeIntervals(interval, from_slot1, to_slot1) {
  //TODO: Change the way we do this with specific dates in calendar
  let nextDay;

  to_slot1 <= from_slot1 ? (nextDay = 2) : (nextDay = 1);

  const result = eachMinuteOfInterval(
    {
      start: new Date(2021, 1, 1, from_slot1, 0),
      end: new Date(2021, 1, nextDay, to_slot1, 0),
    },
    { step: interval }
  );

  const times = result.map((item) => format(item, 'hh:mmaaa'));

  return times;
}

export default function Poll() {
  const history = useHistory()
  const [eventData, setEventData] = useState({
    event_name: '',
    description: '',
    initiator_name:'',
    recurring: false,
    from_slot: 'default',
    to_slot: 'default',
    survey_end: 'default',
    timezone: 'default'
  });
  const [selectedDaysWeek, setSelectedDaysWeek] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [selectedDaysMonth, setSelectedDaysMonth] = useState([]);
  const [endDaysISO, setEndDaysISO] = useState([]);
  const [endDaysFormatted, setEndDaysFormatted] = useState([]);

  useEffect(() => {
    const [ISODays, FormattedDays] = getSurveyEndDays();

    setEventData({
      ...eventData,
      timeZone: currentTimeZone,
    });
    setEndDaysISO(ISODays);
    setEndDaysFormatted(FormattedDays);
  }, []);

  function handleDayClick(day, { selected }) {
    // TODO: Find a way to parse the date format we get from the calendar selected days
    // TODO: Prevent selecting days before todays date
    // TODO: Change the calendar timezone in relation to the one selected from the user
    const inputSelectedDays = selectedDaysMonth.concat();

    if (selected) {
      const selectedIndex = inputSelectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );

      inputSelectedDays.splice(selectedIndex, 1);
    } else {
      inputSelectedDays.push(day);
    }

    setSelectedDaysMonth(inputSelectedDays);
  }

  function handleChange(event) {
    const { value, name } = event.target;

    setEventData({
      ...eventData,
      [name]: value,
    });
  }

  function handleSwitch(event) {
    let { checked } = event.target;

    checked = !recurring;
    setEventData({
      ...eventData,
      recurring: !recurring,
    });
  }

  function handleSubmit(eventData) {
    
    const {
      event_name,
      description,
      initiator_name,
      recurring,
      survey_end1,
      timezone,
      from_slot1,
      to_slot1,
      selectedDaysWeek,
      selectedDaysMonth,
    } = eventData;
    //const hours = setTimeIntervals(30, from_slot, to_slot);

    //implemented 
    // const [hours1, minutes1] = (from_slot1 + ":00").split(":");
    // const suffixs = hours1 >= 12 ? "pm" : "am";
    // const formatted_Hours = hours1 % 12 || 12; // convert to 12-hour format
    // const formatted_Minutes = minutes1.padStart(2, "0");
    // const from_slot = `${formatted_Hours}:${formatted_Minutes} ${suffixs}`;

    // const [hours2, minutes2] = (to_slot1 + ":00").split(":");
    // const suffixs2 = hours2 >= 12 ? "pm" : "am";
    // const formatted_Hours2 = hours2 % 12 || 12; // convert to 12-hour format
    // const formatted_Minutes2 = minutes2.padStart(2, "0");
    // const to_slot = `${formatted_Hours2}:${formatted_Minutes2} ${suffixs2}`;

    

    let days;
    recurring
      ? (days = selectedDaysWeek)
      : (days = selectedDaysMonth.map((item) => formatISO(new Date(item))));
    const datefromday = days[0];
    const formattedDate = datefromday.slice(0, -6); // remove timezone offset
    const result = JSON.stringify(formattedDate);
    const date = result.slice(1, -1);

    const from_slot=date.split('T')[0]+" "+from_slot1+":00"+":00";
    const to_slot=date.split('T')[0]+" "+to_slot1+":00"+":00";

    //console.log(survey_end1)
    
    const survey_end = survey_end1.slice(0, -6); // remove timezone offset

    //console.log(survey_end)
    const email=""
    const user_type=1

    const data = {
      event_name,
      description,
      initiator_name,
      date,
      recurring,
      from_slot,
      to_slot,
      survey_end,
      timezone,
      email,
      user_type
    };
    data.date=(data.date.split('T') && data.date.split('T').length>0 )?(data.date.split('T')[0]+" "+data.date.split('T')[1]):"";
    data.survey_end=(data.survey_end.split('T') && data.survey_end.split('T').length>0 )?(data.survey_end.split('T')[0]+" "+data.survey_end.split('T')[1]):"";
    
    const data2 = JSON.stringify(data)
    console.log(data2);

    const config = {
      headers: {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    axios
      .post(
        'http://34.125.236.71:8800/initiate_poll',
        data2, config
      )
      .then((response) => {
        //let id = response.data.poll_id;
        if(response && response.data && response.data.poll_id){
          alert("Poll has been Successfully created!! The meeting id generated is  "+response.data.poll_id);
        }
        console.log(id)
      })
      .catch(error => {
        console.error(error);
      });
  }

  const {
    event_name,
    description,
    initiator_name,
    recurring,
    from_slot1,
    to_slot1,
    survey_end1,
    timezone,
  } = eventData;

  return (
    <Layout>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Row className="create-event__head">
        <Col>
          <h2>Create Group Poll</h2>
          <h3 style={{fontStyle: 'italic'}}> Create a poll to find the availability of the users </h3>
        </Col>
      </Row>

      <Row className="create-event__data">
        <Col lg={6} xs={12} className="create-event__data__form">
          {/* TODO: Validate fields before submitting the data */}
          <Form>
            <Form.Group controlId="event_name">
              <Form.Control
                name="event_name"
                type="text"
                placeholder="What's the Meeting Name?"
                value={event_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Control
                name="description"
                type="text"
                placeholder="Please include details like Agenda, Instructions and Details"
                value={description}
                onChange={handleChange}
              />
            
            </Form.Group>
            <Form.Group controlId="initiator_name">
              <Form.Control
                name="initiator_name"
                type="text"
                placeholder="Poll Inititator Name"
                value={initiator_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="recurring">
              <Form.Check
                name="recurring"
                type="switch"
                label="Does this event happen every week?"
                onChange={handleSwitch}
              />
            </Form.Group>

            <Row>
              <Col xm={6}>
                <Form.Group controlId="from_slot1">
                  <Form.Control
                    name="from_slot1"
                    as="select"
                    value={from_slot1}
                    onChange={handleChange}
                  >
                    <option value="default">Start Time</option>
                    {dayHours.map((hour, index) => (
                      <option key={`init-hour-${index}`} value={hour[0]}>
                        {hour[1]}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col xm={6}>
                <Form.Group controlId="to_slot1">
                  <Form.Control
                    name="to_slot1"
                    as="select"
                    value={to_slot1}
                    onChange={handleChange}
                  >
                    <option value="default">End time</option>
                    {dayHours.map((hour, index) => (
                      <option key={`finish-hour-${index}`} value={hour[0]}>
                        {hour[1]}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="survey_end1">
              <Form.Control
                name="survey_end1"
                as="select"
                value={survey_end1}
                onChange={handleChange}
              >
                <option value="default">Enter the survey's end day</option>
                {endDaysFormatted.map((days, index) => (
                  <option
                    key={`survey-end-day-${index}`}
                    value={endDaysISO[index]}
                  >
                    {days}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="timezone">
              <Form.Control
                name="timezone"
                as="select"
                value={timezone}
                onChange={handleChange}
              >
                {aryIannaTimeZones.map((timeZone, index) => (
                  <option key={`timezone-${index}`} value={timeZone}>
                    {timeZone}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>

        <Col
          lg={6}
          xs={12}
          className="create-event__data__calendar d-flex flex-column"
        >
          <Form.Label>Select your times</Form.Label>

          {!recurring ? (
            <DayPicker
              selectedDays={selectedDaysMonth}
              onDayClick={handleDayClick}
            />
          ) : (
            <WeekDayPicker
              state={selectedDaysWeek}
              manageState={setSelectedDaysWeek}
            />
          )}
        </Col>

        <Col xs={12} className="create-event__data__submit">
          <Button
            onClick={() =>
              handleSubmit({
                ...eventData,
                selectedDaysWeek,
                selectedDaysMonth,
              })
            }
          >
            Create Poll and Continue
          </Button>
        </Col>
      </Row>
    </Layout>
  );
}
