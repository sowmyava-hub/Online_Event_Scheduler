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
  let createdPolls = [];
  let votedPolls = [];

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
    const createdPollsFromLS = localStorage.getItem("oesCreatedPolls");

    if (createdPollsFromLS) {
      const createdPollsFromLSJSON = JSON.parse(createdPollsFromLS);

      for (let i = 0; i < createdPollsFromLSJSON.polls.length; i += 1) {
        createdPolls.push(createdPollsFromLSJSON.polls[i]);
      }
    }

    let votedPollsFromLS = localStorage.getItem("oesVotedPolls");

    if (votedPollsFromLS) {
      const votedPollsFromLSJSON = JSON.parse(votedPollsFromLS);

      for (let i = 0; i < votedPollsFromLSJSON.polls.length; i += 1) {
        votedPolls.push(votedPollsFromLSJSON.polls[i]);
      }
    }

    const votedPollsClassName = `poll-container ${createdPolls.length > 0 ? "mt-5" : ""
      }`;
    console.log(createdPolls);

    if (createdPolls.length || votedPolls.length) {
      pageSection = (
        <div className="global-page-section">
          {createdPolls.length > 0 && (
            <Container className="poll-container">
              <span className="your-polls-polls-heading">Created polls</span>
              {createdPolls.map((poll) => (
                <Card
                  className="your-polls-poll-card"
                  key={Object.keys(poll)[0]}
                >
                  <Card.Body>
                    <Card.Title>
                      <span className="poll-name">
                        <a
                          href={`/poll/${Object.keys(poll)[0].split("-")[0]
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
                              `/poll/${Object.keys(poll)[0].split("-")[0]
                              }/${decrypt(poll[Object.keys(poll)[0]])}`
                            )
                          }
                        >
                          <BoxArrowUpRight className="icon" />
                        </Button>
                        <DeletePoll
                          pollID={Object.keys(poll)[0].split("-")[0]}
                          pollTitle={Object.keys(poll)[0].split("-")[1] || ""}
                          secret={decrypt(poll[Object.keys(poll)[0]])}
                        />
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
            <span className="first-line">No recent polls</span>
            <span className="second-line">
              Looks like you haven't created or voted on any polls
            </span>
            <Link href="/" passHref>
              <Button className="global-small-primary-btn">
                Create a poll
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
        <title>OES — Recent polls</title>
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
