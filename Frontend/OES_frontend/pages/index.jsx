import React, { useState, useEffect } from 'react';
// import { format, formatISO, eachMinuteOfInterval } from 'date-fns';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Layout from "../src/components/Layout";
import axios from 'axios';
//import './main_page.css'; 
//import Banner from '../public/banner_copy.png';
import UserProfile from './session';


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
      <div className="bg-pattern min-h-full overflow-x-hidden snipcss-1r7gb">
        <div className="md:min-h-[calc(100vh-460px)]">
          <div className="mx-auto max-w-7xl items-end p-8 lg:flex lg:justify-between">
            <div className="my-8 text-center lg:text-left">
              <h1 className="text-4xl font-bold sm:text-5xl">
                <br></br>
                Find a time
                <br />
                <span className="text-primary-500 whitespace-nowrap">
                  that works
                </span>
                <br />
                for everyone!
              </h1>
              <div className="mb-12 text-xl text-gray-400">
                Schedule group meetings with ease...
              </div>
              <div className="space-x-3">
                <a href="/poll" className="bg-primary-500 hover:bg-primary-500/90 active:bg-primary-600/90 rounded-lg px-5 py-3 font-semibold text-white shadow-sm transition-all hover:text-white hover:no-underline hover:shadow-md">
                  Create Poll
                </a>
                <br></br>
                <br></br>
                <br></br>

              </div>
              {!UserProfile.getId() && <div class="space-x-3">
                <a href="/login" class="bg-primary-500 hover:bg-primary-500/90 active:bg-primary-600/90 rounded-lg px-5 py-3 font-semibold  text-white shadow-sm transition-all hover:text-white hover:no-underline hover:shadow-md">
                  Create Meeting
                </a>
              </div>}
              {UserProfile.getId() && <div class="space-x-3">
                <a href="/meeting" class="bg-primary-500 hover:bg-primary-500/90 active:bg-primary-600/90 rounded-lg px-5 py-3 font-semibold  text-white shadow-sm transition-all hover:text-white hover:no-underline hover:shadow-md">
                  Create Meeting
                </a>

              </div>}
              <br></br>
              <br></br>
              <br></br>
            </div>
            <div className="flex justify-center items-center mt-6" style={{ height: '60vh' }}>
              <div className="max-h-full overflow-y-auto" style={{ padding: '0 10%' }}>
                <img src="/banner.png" style={{ width: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'center', opacity: 1 }}></img>
              </div>
            </div>
            <br></br>
            <br></br>

          </div>
        </div>
      </div>
    </Layout>
  );
}
