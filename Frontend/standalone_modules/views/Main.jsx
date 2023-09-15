import React, { useState, useEffect } from 'react';
import { format, formatISO, eachMinuteOfInterval } from 'date-fns';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DayPicker, { DateUtils } from 'react-day-picker';
import WeekDayPicker from '../components/WeekDayPicker';
import Layout from './Layout';
import axios from 'axios';
import { useHistory } from 'react-router';
import './main_page.css';   

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
 * @param {*} initialTime The initial hour of the event
 * @param {*} finishTime  The finish hour of the event
 * @returns An array with the current steps intervals and parsed hour format
 */
function setTimeIntervals(interval, initialTime, finishTime) {
  //TODO: Change the way we do this with specific dates in calendar
  let nextDay;

  finishTime <= initialTime ? (nextDay = 2) : (nextDay = 1);

  const result = eachMinuteOfInterval(
    {
      start: new Date(2021, 1, 1, initialTime, 0),
      end: new Date(2021, 1, nextDay, finishTime, 0),
    },
    { step: interval }
  );

  const times = result.map((item) => format(item, 'hh:mmaaa'));

  return times;
}

export default function Main() {
  
  return (
    <Layout>
<div class="bg-pattern min-h-full overflow-x-hidden snipcss-1r7gb">
    
  <div class="md:min-h-[calc(100vh-460px)]">
    <div class="mx-auto max-w-7xl items-end p-8 lg:flex lg:justify-between">
      <div class="my-8 text-center lg:text-left">
        <h1 class="text-4xl font-bold sm:text-5xl">
            <br></br>
          Find a time 
          <br/>
          <span class="text-primary-500 whitespace-nowrap">
            that works
          </span>
          <br/>
          For everyone!
        </h1>
        <div class="mb-12 text-xl text-gray-400">
          Schedule group meetings with ease...        
        </div>
        <div class="space-x-3">
          <a href="/new" class="bg-primary-500 hover:bg-primary-500/90 active:bg-primary-600/90 rounded-lg px-5 py-3 font-semibold  text-white shadow-sm transition-all hover:text-white hover:no-underline hover:shadow-md">
            Create Poll
          </a>
          <img src={require('./Banner.png').default} style={{position: 'absolute', top: 140, left: 490, width: 700, height: 500, objectFit: 'contain', objectPosition: 'center' , opacity: 1}}></img>
        </div>
      </div>
      </div>
      </div>
        
</div>
</Layout>
  );
}
