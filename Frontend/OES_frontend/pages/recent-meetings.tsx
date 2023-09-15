import { Card, Container, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { Grid, BoxArrowUpRight, Trash } from "react-bootstrap-icons";
import Router from "next/router";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { decrypt } from "../src/helpers";
import Layout from "../src/components/Layout";
import DeletePoll from "../src/components/poll/DeletePoll";
import axios from 'axios';
import UserProfile from './session';


const RemoveVotedPollModal = (props: {
  show;
  onHide;
  deleteVotedPoll;
  poll;
}): JSX.Element => {
  const { deleteVotedPoll, poll } = props;

  return (
    <Modal
      {...props}
      dialogClassName="modal-60w"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Remove poll
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to remove this poll?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => deleteVotedPoll(Object.keys(poll)[0].split("-")[0])}
        >
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const RecentPolls = (): JSX.Element => {
  const fetch_meeting = function () {

    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // };

    axios
      .get(
        'https://application-48.115t501qrjh8.us-east.codeengine.appdomain.cloud/api/meeting?userid=' + UserProfile.getId()
      )
      .then((response) => {
        if (response && response.data && response.data['Meeting details'].length > 0) {
          //console.log("meeting fetched");
          for (let i = 0; i < response.data['Meeting details'].length; i++) {
            let data_obj = response.data['Meeting details'][i];
            let obj = {};
            obj[data_obj.endate + "-" + data_obj.title + "-" + data_obj.userid] = data_obj.secret;
            new_created_polls.push(obj);
          }




        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  let createdPolls = [];
  let votedPolls = [];
  let new_created_polls = UserProfile.getUserData();
  //fetch_meeting();
  let pageSection = <></>;


  const [modalShow, setModalShow] = useState(false);

  const deleteVotedPoll = (pollID) => {
    if (typeof window !== "undefined") {
      const allVotedPolls = localStorage.getItem("oesVotedPolls");

      if (allVotedPolls) {
        const oesVotedPollsJSON = JSON.parse(allVotedPolls);

        let newOesVotedPolls = {
          polls: oesVotedPollsJSON.polls.filter(
            (poll) => Object.keys(poll)[0] !== `${pollID}`
          ),
        };

        localStorage.setItem(
          "oesVotedPolls",
          JSON.stringify(newOesVotedPolls)
        );

        Router.reload();
      }
    }
  };



  if (typeof window !== "undefined") {
    const createdPollsFromLS = localStorage.getItem("oesCreatedMeetings");

    if (createdPollsFromLS) {
      const createdPollsFromLSJSON = JSON.parse(createdPollsFromLS);

      for (let i = 0; i < createdPollsFromLSJSON.polls.length; i += 1) {
        createdPolls.push(createdPollsFromLSJSON.polls[i]);
      }
    }

    let votedPollsFromLS = localStorage.getItem("oesVotedMeetings");

    if (votedPollsFromLS) {
      const votedPollsFromLSJSON = JSON.parse(votedPollsFromLS);

      for (let i = 0; i < votedPollsFromLSJSON.polls.length; i += 1) {
        votedPolls.push(votedPollsFromLSJSON.polls[i]);
      }
    }

    const votedPollsClassName = `poll-container ${createdPolls.length > 0 || new_created_polls.length > 0 ? "mt-5" : ""
      }`;
    console.log(createdPolls);

    if (createdPolls.length > 0) {
      for (let j = 0; j < createdPolls.length; j++) {
        let f = 0;
        for (let k = 0; k < new_created_polls.length; k++) {
          let key = Object.keys(createdPolls[j]);
          if (Object.keys(new_created_polls[k])[0] == key[0]) {
            f = 1;

          }
        }
        if (f == 0) {
          new_created_polls.push(createdPolls[j]);
        }
      }
    }

    if (createdPolls.length || new_created_polls.length) {
      pageSection = (
        <div className="global-page-section">
          {new_created_polls.length > 0 && (
            <Container className="poll-container">
              <span className="your-polls-polls-heading">Created Meetings</span>
              {new_created_polls.map((poll) => (
                <Card
                  className="your-polls-poll-card"
                  key={Object.keys(poll)[0]}
                >
                  <Card.Body>
                    <Card.Title>
                      <span className="poll-name">
                        <a
                          href={`/meeting/${Object.keys(poll)[0].split("-")[0]
                            }/${decrypt(poll[Object.keys(poll)[0]])}`}
                        >
                          {Object.keys(poll)[0].split("-")[1] || "Untitled"}
                        </a>

                      </span>
                      <div className="card-options">
                        <Button
                          className="option-button"
                          onClick={() =>
                            Router.push(
                              `/meeting/${Object.keys(poll)[0].split("-")[0]
                              }/${decrypt(poll[Object.keys(poll)[0]])}`
                            )
                          }
                        >
                          <BoxArrowUpRight className="icon" />
                        </Button>
                        {/* <DeletePoll
                          pollID={Object.keys(poll)[0].split("-")[0]}
                          pollTitle={Object.keys(poll)[0].split("-")[1] || ""}
                          secret={decrypt(poll[Object.keys(poll)[0]])}
                        /> */}
                      </div>
                    </Card.Title>
                  </Card.Body>
                </Card>
              ))}
            </Container>
          )}
          {votedPolls.length > 0 && (
            <Container className={votedPollsClassName}>
              <span className="your-polls-polls-heading">Voted polls</span>
              {votedPolls.map((poll) => (
                <Card
                  className="your-polls-poll-card"
                  key={Object.keys(poll)[0]}
                >
                  <Card.Body>
                    <Card.Title>
                      <span className="poll-name">
                        <a href={`/poll/${Object.keys(poll)[0].split("-")[0]}`}>
                          {Object.keys(poll)[0].split("-")[1] || "Untitled"}
                        </a>
                      </span>
                      <div className="card-options">
                        <Button
                          className="option-button"
                          onClick={() =>
                            Router.push(
                              `/poll/${Object.keys(poll)[0].split("-")[0]}`
                            )
                          }
                        >
                          <BoxArrowUpRight className="icon" />
                        </Button>
                        <Button
                          className="trash-button"
                          onClick={() => setModalShow(true)}
                        >
                          <Trash className="icon" />
                        </Button>
                        <RemoveVotedPollModal
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                          deleteVotedPoll={deleteVotedPoll}
                          poll={poll}
                        />
                      </div>
                    </Card.Title>
                  </Card.Body>
                </Card>
              ))}
            </Container>
          )}
        </div>
      );
    } else {
      pageSection = (
        <div className="global-page-section">
          <Container className="no-poll-container">
            <Grid className="icon" />
            <span className="first-line">No meetings scheduled</span>
            <span className="second-line">
              Looks like you haven't created any meetings
            </span>
            <Link href="/" passHref>
              <Button className="global-small-primary-btn">
                Create a Meeting
              </Button>
            </Link>
          </Container>
        </div>
      );
    }
  }

  return (
    <>
      <Head>
        <title>OES — Recent Meetings</title>
        <link rel="shortcut icon" href="/logo.png" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="4g7sVHEgHkqmu_q066ocloQj3YI8pOz7IHC8ibisQHk"
        />
        <meta property="twitter:image" content="/banner.png" />
      </Head>
      <Layout>{pageSection}</Layout>
    </>
  );
};

export default RecentPolls;
