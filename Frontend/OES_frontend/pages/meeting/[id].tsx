import React, { useState } from "react";
import Router from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { Form } from "react-bootstrap";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { getPoll } from "../../src/utils/api/server";
import VoterMeetinginfo from "../../src/components/poll/VoterMeetinginfo";
import MeetingTableVoter from "../../src/components/poll/MeetingTableVoter";
import SubmitMeetingTimes from "../../src/components/poll/SubmitMeetingTimes";
import { TimeFromDB, Vote, Recevent, PollFromDB } from "../../src/models/poll";
import { decrypt } from "../../src/helpers";

dayjs.extend(localizedFormat);

const Poll = (props: {
  pollFromDB: PollFromDB;
  pollID: string;
}): JSX.Element => {
  const { pollFromDB, pollID } = props;

  let pageSection = <></>;

  const sortedTimes: TimeFromDB[] = pollFromDB.times.sort(
    (a: TimeFromDB, b: TimeFromDB) => a.start - b.start
  );

  // const [newVote, setNewVote] = useState<Vote>({
  //   name: "",
  //   times: [],
  // });
  const [newVote, setNewVote] = useState<Recevent>({
    recurr_event: []
  });



  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const { value } = e.target;
  //   setNewVote({ name: value, times: newVote.times });
  // };

  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const { value } = e.target;
  //   setNewVote({ times: newVote.times });
  // };

  if (typeof window !== "undefined") {
    let createdPollsFromLS = JSON.parse(
      localStorage.getItem("oesCreatedPolls")
    );

    if (createdPollsFromLS && createdPollsFromLS.polls.length) {
      const lSKeyForPoll = `${pollID}-${pollFromDB.title ? pollFromDB.title : ""
        }`;

      for (let i = 0; i < createdPollsFromLS.polls.length; i += 1) {
        let poll = createdPollsFromLS.polls[i];

        if (
          Object.keys(poll)[0] === lSKeyForPoll &&
          poll[Object.keys(poll)[0]] === pollFromDB.secret
        ) {
          Router.push(`/poll/${pollID}/${decrypt(pollFromDB.secret)}`);
          return <></>;
        }
      }
    }

    let votedPollsFromLS = JSON.parse(localStorage.getItem("oesVotedPolls"));

    if (votedPollsFromLS && votedPollsFromLS.polls.length) {
      for (let i = 0; i < votedPollsFromLS.polls.length; i += 1) {
        let poll = votedPollsFromLS.polls[i];
        let meetingdata = JSON.parse(localStorage.getItem("Meeting_data"));
        console.log(meetingdata);
        if (Object.keys(poll)[0] === pollID && pollFromDB.open) {
          pageSection = (
            <>
              <div className="voter-page-final-container">
                <span className="voter-page-vote-recorded">
                  Your meeting has been successfully booked.
                  <ul>
                    {pollFromDB.recurr_event
                      .filter((event) => event.title == meetingdata)
                      .map((event) => (
                        <li key={event.event_id}>
                          <span>Booked by: {event.title}</span>
                          <br />
                          <span>Start: {new Date(event.start).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                          <br />
                          <span>End: {new Date(event.end).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                        </li>
                      ))}
                  </ul>
                </span>
              </div>
            </>
          );
          break;
        } else if (pollFromDB.open) {
          pageSection = (
            <>
              <div className="voter-page-main-container">
                <MeetingTableVoter
                  pollFromDB={pollFromDB}
                  sortedTimes={sortedTimes}
                  newVote={newVote}
                  setNewVote={setNewVote}
                />
              </div>
              <div className="voter-page-final-container">
                <SubmitMeetingTimes
                  newVote={newVote}
                  pollID={pollID}
                  pollFromDB={pollFromDB}
                />
              </div>
            </>
          );
        }
      }
      // below flow for first time selection
    } else if (pollFromDB.open) {
      pageSection = (
        <>
          <div className="voter-page-main-container">
            <MeetingTableVoter
              pollFromDB={pollFromDB}
              sortedTimes={sortedTimes}
              newVote={newVote}
              setNewVote={setNewVote}
            />
          </div>
          <div className="voter-page-final-container">
            <SubmitMeetingTimes
              newVote={newVote}
              pollID={pollID}
              pollFromDB={pollFromDB}
            />
          </div>
        </>
      );
    }
  }

  return (
    <>
      <Head>
        <title>OES — Mark your appointment</title>
        <link rel="shortcut icon" href="/logo.png" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="global-flex-wrapper">
        <main className="voter-page-main">
          <div
            className={`voter-page-info-container ${pollFromDB.open ? "" : "closed"
              }`}
          >
            <VoterMeetinginfo poll={pollFromDB} showFinalTime={!pollFromDB.open} />
          </div>
          {pageSection}
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let pollID = null;
  if (context.params) {
    pollID = context.params.id;
  }
  const getPollResponse = await getPoll(pollID);
  const pollFromDB = getPollResponse.data;

  if (getPollResponse.statusCode === 404) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: { pollFromDB, pollID }, // will be passed to the page component as props
  };
};

export default Poll;
