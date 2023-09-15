import Router from "next/router";
import Head from "next/head";
import {
  Row,
  Col,
  Form,
  Container,
  Jumbotron,
  Button,
  Spinner,
} from "react-bootstrap";
import { nanoid } from "nanoid";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import toastOptions from "../src/helpers/toastOptions";
import Layout from "../src/components/Layout";
import { encrypt } from "../src/helpers";
import { Time, Poll } from "../src/models/poll";
import OesCalendar from "../src/components/OesCalendar";
import { createPoll } from "../src/utils/api/server";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Theme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HomePage } from "./calendarcomp";
import { theme } from "./theme";
import UserProfile from './session';
import { bgcolor } from "@mui/system";




// import DateTimePicker from "react-datetime-picker";

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

const Home = (): JSX.Element => {
  const [pollDetails, setPollDetails] = useState<{
    pollTitle: string;
    pollLocation: string;
    pollDescription: string;
  }>({
    pollTitle: "",
    pollLocation: "",
    pollDescription: "",
  });

  const { pollTitle, pollLocation, pollDescription } = pollDetails;

  const [pollTimes, setTimes] = useState<Time[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [recurrence, setrecurrence] = useState("");
  const classes = useStyles();
  //const [date, setDate] = useState(new Date());
  //setDate(new Date(UserProfile.getEnddate()));

  const handlePollDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    setPollDetails({
      ...pollDetails,
      [name]: value,
    });
  };


  const ontoggle = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setDropdown(event.target.checked);
    // console.log(val1);

  };

  const getrecurrance = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setrecurrence(event.target.value);
    // console.log(val1);

  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLInputElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log(UserProfile.getEnddate());
    if (!UserProfile.getEnddate()) {
      toast.error("Please select suitable end date!!", toastOptions);
      return;
    }
    if (!pollTimes || (pollTimes && pollTimes?.length < 2)) {
      toast.error("Please select at least two time slots", toastOptions);
      return;
    }

    const days = Math.round((new Date(UserProfile.getEnddate()).getTime() - new Date(pollTimes[pollTimes.length - 1].end).getTime()) / (1000 * 60 * 60 * 24));
    const days_res = Math.abs(days).toFixed(0);
    console.log(new Date().getTime() - new Date(UserProfile.getEnddate()).getTime());
    if (days < 0 && ((new Date().getTime() - new Date(UserProfile.getEnddate()).getTime()) / (1000 * 60 * 60 * 24)) < -30) {
      toast.error("Please select Polling end date that is within the time frame of 30 days", toastOptions);
      return;
    }
    if ((new Date(UserProfile.getEnddate()).getTime() - new Date(pollTimes[pollTimes.length - 1].end).getTime()) > 0) {
      toast.error("Please select Polling end date that is before meeting end date", toastOptions);
      return;
    }
    if (days > 0) {
      toast.error("Please select Polling end date that is before the meeting day", toastOptions);
      return;
    }

    const secret = nanoid(10);
    const encryptedSecret = encrypt(secret);

    const poll: Poll = {
      title: pollTitle,
      description: pollDescription,
      location: pollLocation,
      secret: encryptedSecret,
      times: pollTimes,
      endate: UserProfile.getEnddate().toLocaleDateString() + " " + UserProfile.getEnddate().toLocaleTimeString(),
      recurr: recurrence ? recurrence : "",
      userid: "",
      recurr_endate: "",
      recurr_event: []
    };

    try {
      setDisabled(true);

      const createPollResponse = await createPoll({
        poll,
      });

      if (createPollResponse.statusCode === 201) {
        if (typeof window !== "undefined") {
          const oesCreatedPolls = localStorage.getItem("oesCreatedPolls");

          if (!oesCreatedPolls) {
            const initOesCreatedPolls = {
              polls: [
                {
                  [`${createPollResponse.data._id}-${pollTitle}`]: `${encryptedSecret}`,
                },
              ],
            };

            localStorage.setItem(
              "oesCreatedPolls",
              JSON.stringify(initOesCreatedPolls)
            );
          } else {
            let oesCreatedPollsJSON = JSON.parse(oesCreatedPolls);

            oesCreatedPollsJSON.polls.push({
              [`${createPollResponse.data._id}-${pollTitle}`]: `${encryptedSecret}`,
            });

            localStorage.setItem(
              "oesCreatedPolls",
              JSON.stringify(oesCreatedPollsJSON)
            );
          }
        }
        Router.push(`/poll/${createPollResponse.data._id}/${secret}`);
      } else {
        setDisabled(false);
        toast.error(
          "Poll creation failed, please try again later",
          toastOptions
        );
      }
    } catch (err) {
      setDisabled(false);
      toast.error("Poll creation failed, please try again later", toastOptions);
    }
  };

  return (
    <>
      <Head>
        <title>OES — Poll</title>
        <link rel="shortcut icon" href="/logo.png" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="4g7sVHEgHkqmu_q066ocloQj3YI8pOz7IHC8ibisQHk"
        />
        <meta property="twitter:image" content="/banner.png" />
      </Head>
      <Layout>
        <div className="global-page-section" style={{
          backgroundImage: `url(https://cutewallpaper.org/21/grey-and-white-background/Abstract-Grey-and-White-Polygon-Background-Graphic-Design-Image.jpg)`,
        }}>
          <Container className="global-container">
            <Jumbotron className="new-poll-jumbo" style={{
              height: "100px"
            }}>
              <h2>Create new Poll</h2>
              <p style={{ color: "black", fontStyle: "italic" }}>Find the best time for everyone to meet!</p>
            </Jumbotron>
            <Jumbotron className="new-poll-jumbo" style={{
              height: "160px"
            }}>
              <Row>
                <Col sm>
                  <Form.Label >Title</Form.Label>
                  <textarea
                    className="form-text"
                    type="textarea"
                    maxLength={300}
                    placeholder="What's the Occasion?"
                    name="pollTitle"
                    onChange={handlePollDetailsChange}
                    style={{ height: "75px;" }}

                  />
                </Col>
                <Col sm>
                  <Form.Label >Description</Form.Label>
                  <textarea
                    className="form-text"
                    type="text"
                    name="pollDescription"
                    maxLength={500}
                    placeholder="Here you can include things like agenda, instructions and other details"
                    onChange={handlePollDetailsChange}
                    style={{ height: "75px;" }}
                  />
                </Col>

                <Col sm>
                  <Form.Label >Location</Form.Label>
                  <textarea
                    className="form-text"
                    type="text"
                    name="pollLocation"
                    maxLength={400}
                    placeholder="Where will this happen?"
                    onChange={handlePollDetailsChange}
                    style={{ height: "75px;" }}
                  />
                </Col>
                {/* <Col sm style={{ right: "-27px" }}>

                  <Form.Label style={{ margin: "-4px" }}>Recurrence</Form.Label>
                  <Form.Group controlId="recurring">
                    <Form.Check
                      name="recurring"
                      type="switch"
                      label="Does this event happen every week?"
                      onChange={ontoggle}
                    />

                  </Form.Group>

                  {dropdown && <FormControl className={classes.formControl} >
                    <Select style={{ top: "-58px;" }}
                      labelId="timezone-label"
                      id="timezone-select"
                      onChange={getrecurrance}
                    >

                      <MenuItem key={""} value="Every Week" >
                        Every Week
                      </MenuItem>
                      <MenuItem key={""} value="Bi weekly" >
                        Bi weekly
                      </MenuItem>
                      <MenuItem key={""} value="Tri weekly">
                        Tri weekly
                      </MenuItem>

                    </Select>
                  </FormControl>}

                </Col> */}

                <Col sm style={{ top: "0px" }}>
                  <ThemeProvider theme={theme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <CssBaseline />
                      <HomePage />
                    </MuiPickersUtilsProvider>
                  </ThemeProvider>

                </Col>


                <Col sm="auto">
                  <Button
                    className="global-primary-button"
                    onClick={handleSubmit}
                    disabled={disabled}
                    style={{ backgroundColor: "black" }}
                  >
                    {!disabled ? (
                      `Create`
                    ) : (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="form-button-spinner"
                        />
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </Jumbotron>
            <Jumbotron className="new-poll-timeslot-jumbo">
              <OesCalendar pollTimes={pollTimes} setTimes={setTimes} />
            </Jumbotron>

            <ToastContainer />
          </Container>
        </div>
      </Layout>
    </>
  );
};

export default Home;
