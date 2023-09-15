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
import { HomePage } from "./calendarcomp_recurr";
import { theme } from "./theme";
import UserProfile from './session';
import 'moment-timezone';
import moment from 'moment';
import axios from 'axios';
import { ConstructionRounded } from "@mui/icons-material";
import { fontStyle } from "@mui/system";



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

const Meeting = (): JSX.Element => {
    const [pollDetails, setPollDetails] = useState<{
        pollTitle: string;
        pollLocation: string;
        pollDescription: string;
    }>({
        pollTitle: "",
        pollLocation: "",
        pollDescription: "",
    });
    const events = [];
    const { pollTitle, pollLocation, pollDescription } = pollDetails;

    const [pollTimes, setTimes] = useState<Time[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [dropdown, setDropdown] = useState<boolean>(false);
    const [dailytoggle, setDailytoggle] = useState<boolean>(true);
    const [recurrence, setrecurrence] = useState("");
    const [dayselection, setDayselection] = useState("0");
    const classes = useStyles();
    let recurr_display;
    //setDailytoggle(false);
    //const [date, setDate] = useState(new Date());
    //setDate(new Date(UserProfile.getEnddate()));

    if (pollTimes.length > 0) {
        let temp_data = pollTimes;
        temp_data.sort();
        recurr_display = moment(temp_data[0].start).format("MM/DD/YYYY");
    }

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
        if (!event.target.checked) {
            setrecurrence("");
        }
        // console.log(val1);

    };

    const getrecurrance = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        setrecurrence(event.target.value);
        if (event.target.value != "Daily") {
            setDailytoggle(false);
        } else {
            setDailytoggle(true);
        }
        // setDropdown(false);
        // console.log(val1);

    };

    const onChangeValue = function (event) {
        setDayselection(event.target.value);
    }
    const create_meeting = function (meeting_id, poll) {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios
            .post(
                'https://application-48.115t501qrjh8.us-east.codeengine.appdomain.cloud/api/meeting/create',
                poll, config
            )
            .then((response) => {
                if (response && response.data) {
                    console.log("meeting not");

                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleSubmit = async (
        e: React.MouseEvent<HTMLInputElement>
    ): Promise<void> => {
        e.preventDefault();
        console.log(UserProfile.getEnddate());
        if (!pollTimes || (pollTimes && pollTimes?.length < 2)) {
            toast.error("Please select at least two time slots", toastOptions);
            return;
        }

        // const days = Math.round((new Date(UserProfile.getEnddate()).getTime() - new Date(pollTimes[pollTimes.length - 1].end).getTime()) / (1000 * 60 * 60 * 24));
        // const days_res = Math.abs(days).toFixed(0);
        // console.log(new Date().getTime() - new Date(UserProfile.getEnddate()).getTime());
        // if (days < 0 && ((new Date().getTime() - new Date(UserProfile.getEnddate()).getTime()) / (1000 * 60 * 60 * 24)) < -30) {
        //     toast.error("Please select Polling end date that is within the time frame of 30 days", toastOptions);
        //     return;
        // }
        // if ((new Date(UserProfile.getEnddate()).getTime() - new Date(pollTimes[pollTimes.length - 1].end).getTime()) > 0) {
        //     toast.error("Please select Polling end date that is before meeting end date", toastOptions);
        //     return;
        // }
        // if (days > 0) {
        //     toast.error("Please select Polling end date that is before the meeting day", toastOptions);
        //     return;
        // }

        const secret = nanoid(10);
        const encryptedSecret = encrypt(secret);
        if (UserProfile.getRecurr_enddate() && recurrence == "Daily") {

            let c = 0;
            for (let i = 0; i < pollTimes.length; i++) {
                let day = new Date(pollTimes[i].start).getDay();

                var start = new Date(pollTimes[i].start);
                var end = new Date(UserProfile.getRecurr_enddate());

                //var val = start.setDate(start.getDate() + 1);
                var loop = new Date(start);
                while (loop <= end) {
                    day = new Date(loop).getDay();
                    if (dayselection != "0" && dayselection == "2" && (day == 0 || day == 6)) {
                        var newDate = loop.setDate(loop.getDate() + 1);
                        loop = new Date(newDate);
                        continue;
                    }

                    const obj = {
                        title: pollTitle,
                        start_month: new Date(loop).getMonth() + 1,
                        end_month: new Date(loop).getMonth() + 1,
                        start_date: new Date(loop).getDate(),
                        end_date: new Date(loop).getDate(),
                        year: new Date(loop).getFullYear(),
                        start_val: moment(pollTimes[i].start).format("HH:mm "),
                        end_val: moment(pollTimes[i].end).format("HH:mm "),
                    };
                    const startValDate = new Date(pollTimes[i].start);
                    const endValDate = new Date(pollTimes[i].end);

                    c++;
                    const finalobj = {

                        event_id: c,
                        title: pollTitle,
                        start: new Date(obj.year, obj.start_month - 1, obj.start_date, startValDate.getHours(), startValDate.getMinutes()),
                        end: new Date(obj.year, obj.end_month - 1, obj.end_date, endValDate.getHours(), endValDate.getMinutes()),
                        color: "black",
                        status: 0
                    };
                    // const finalobj = {

                    //     event_id: c,
                    //     title: pollTitle,
                    //     start: startTime,
                    //     end: new Date(obj.year + " " + obj.end_month + " " + obj.end_date + " " + obj.end_val),
                    //     color: "black",
                    //     status: 0
                    // };

                    events.push(finalobj);



                    var newDate = loop.setDate(loop.getDate() + 1);
                    loop = new Date(newDate);
                }
            }


        } else if (UserProfile.getRecurr_enddate() && recurrence == "Monthly") {

            let c = 0;
            for (let i = 0; i < pollTimes.length; i++) {
                let day = new Date(pollTimes[i].start).getDate();

                var start = new Date(pollTimes[i].start);
                var end = new Date(UserProfile.getRecurr_enddate());

                //var val = start.setDate(start.getDate() + 1);
                var loop = new Date(start);
                while (loop <= end) {
                    if (loop.getDate() == day) {
                        // let day1 = new Date(loop).getDay();
                        // if (dayselection != "0" && dayselection == "2" && (day1 == 0 || day1 == 6)) {
                        //     var newDate = loop.setDate(loop.getDate() + 1);
                        //     loop = new Date(newDate);
                        //     continue;
                        // }

                        const obj = {
                            title: pollTitle,
                            start_month: new Date(loop).getMonth() + 1,
                            end_month: new Date(loop).getMonth() + 1,
                            start_date: new Date(loop).getDate(),
                            end_date: new Date(loop).getDate(),
                            year: new Date(loop).getFullYear(),
                            start_val: moment(pollTimes[i].start).format("HH:mm "),
                            end_val: moment(pollTimes[i].end).format("HH:mm "),
                        };
                        const startValDate = new Date(pollTimes[i].start);
                        const endValDate = new Date(pollTimes[i].end);

                        c++;
                        const finalobj = {

                            event_id: c,
                            title: pollTitle,
                            start: new Date(obj.year, obj.start_month - 1, obj.start_date, startValDate.getHours(), startValDate.getMinutes()),
                            end: new Date(obj.year, obj.end_month - 1, obj.end_date, endValDate.getHours(), endValDate.getMinutes()),
                            color: "black",
                            status: 0
                        };
                        // const finalobj = {

                        //     event_id: c,
                        //     title: pollTitle,
                        //     start: new Date(obj.year + " " + obj.start_month + " " + obj.start_date + " " + obj.start_val),
                        //     end: new Date(obj.year + " " + obj.end_month + " " + obj.end_date + " " + obj.end_val),
                        //     color: "black",
                        //     status: 0
                        // };
                        events.push(finalobj);


                    }
                    var newDate = loop.setDate(loop.getDate() + 1);
                    loop = new Date(newDate);
                }
            }

        } else if (UserProfile.getRecurr_enddate()) {
            let c = 0;
            for (let i = 0; i < pollTimes.length; i++) {
                let day = new Date(pollTimes[i].start).getDay();

                var start = new Date(pollTimes[i].start);
                var end = new Date(UserProfile.getRecurr_enddate());

                //var val = start.setDate(start.getDate() + 1);
                var loop = new Date(start);
                while (loop <= end) {
                    if (loop.getDay() == day) {
                        // let day1 = new Date(loop).getDay();
                        // if (dayselection != "0" && dayselection == "2" && (day1 == 0 || day1 == 6)) {
                        //     var newDate = loop.setDate(loop.getDate() + 1);
                        //     loop = new Date(newDate);
                        //     continue;
                        // }

                        const obj = {
                            title: pollTitle,
                            start_month: new Date(loop).getMonth() + 1,
                            end_month: new Date(loop).getMonth() + 1,
                            start_date: new Date(loop).getDate(),
                            end_date: new Date(loop).getDate(),
                            year: new Date(loop).getFullYear(),
                            start_val: moment(pollTimes[i].start).format("HH:mm "),
                            end_val: moment(pollTimes[i].end).format("HH:mm "),
                        };
                        const startValDate = new Date(pollTimes[i].start);
                        const endValDate = new Date(pollTimes[i].end);

                        c++;
                        const finalobj = {

                            event_id: c,
                            title: pollTitle,
                            start: new Date(obj.year, obj.start_month - 1, obj.start_date, startValDate.getHours(), startValDate.getMinutes()),
                            end: new Date(obj.year, obj.end_month - 1, obj.end_date, endValDate.getHours(), endValDate.getMinutes()),
                            color: "black",
                            status: 0
                        };
                        // const finalobj = {

                        //     event_id: c,
                        //     title: pollTitle,
                        //     start: new Date(obj.year + " " + obj.start_month + " " + obj.start_date + " " + obj.start_val),
                        //     end: new Date(obj.year + " " + obj.end_month + " " + obj.end_date + " " + obj.end_val),
                        //     color: "black",
                        //     status: 0
                        // };
                        events.push(finalobj);


                    }
                    var newDate = loop.setDate(loop.getDate() + 1);
                    loop = new Date(newDate);
                }
            }


        } else {
            let c = 0;
            for (let i = 0; i < pollTimes.length; i++) {
                var start = new Date(pollTimes[i].start);

                //var val = start.setDate(start.getDate() + 1);
                var loop = new Date(start);
                const obj = {
                    title: pollTitle,
                    start_month: new Date(loop).getMonth() + 1,
                    end_month: new Date(loop).getMonth() + 1,
                    start_date: new Date(loop).getDate(),
                    end_date: new Date(loop).getDate(),
                    year: new Date(loop).getFullYear(),
                    start_val: moment(pollTimes[i].start).format("HH:mm "),
                    end_val: moment(pollTimes[i].end).format("HH:mm "),
                };
                const startTime = new Date(pollTimes[i].start);
                const endTime = new Date(pollTimes[i].end)
                c++;
                const finalobj = {

                    event_id: c,
                    title: pollTitle,
                    start: startTime,
                    end: endTime,
                    color: "black",
                    status: 0
                };
                events.push(finalobj);

            }
        }
        const poll: Poll = {
            title: pollTitle,
            description: pollDescription,
            location: pollLocation,
            secret: encryptedSecret,
            times: pollTimes,
            endate: "",
            recurr: recurrence ? recurrence : "",
            userid: UserProfile.getId() ? UserProfile.getId() : undefined,
            recurr_endate: UserProfile.getRecurr_enddate() ? UserProfile.getRecurr_enddate() : "",
            recurr_event: events
        };
        console.log(events);
        console.log("Poll", poll);

        try {
            setDisabled(true);

            const createPollResponse = await createPoll({
                poll,
            });

            if (createPollResponse.statusCode === 201) {
                if (typeof window !== "undefined") {
                    const oesCreatedMeetings = localStorage.getItem("oesCreatedMeetings");
                    poll.endate = createPollResponse.data._id;
                    create_meeting(createPollResponse.data._id, poll);

                    if (!oesCreatedMeetings) {
                        const initOesCreatedMeetings = {
                            polls: [
                                {
                                    [`${createPollResponse.data._id}-${pollTitle}-${UserProfile.getId()}`]: `${encryptedSecret}`,
                                },
                            ],
                        };

                        localStorage.setItem(
                            "oesCreatedMeetings",
                            JSON.stringify(initOesCreatedMeetings)
                        );
                    } else {
                        let oesCreatedMeetingsJSON = JSON.parse(oesCreatedMeetings);

                        oesCreatedMeetingsJSON.polls.push({
                            [`${createPollResponse.data._id}-${pollTitle}-${UserProfile.getId()}`]: `${encryptedSecret}`,
                        });

                        localStorage.setItem(
                            "oesCreatedMeetings",
                            JSON.stringify(oesCreatedMeetingsJSON)
                        );
                    }
                }

                Router.push(`/meeting/${createPollResponse.data._id}/${secret}`);
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
                <title>OES — Meeting</title>
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
                            height: "120px"
                        }}>
                            <h2>Create new meeting</h2>
                            <p style={{ color: "black", fontStyle: "italic" }}>Unlock the Power of Seamless Scheduling: Create Meetings at Your Convenience and Empower Users to Book Appointments Anytime, Anywhere!</p>
                        </Jumbotron>
                        <Jumbotron className="new-poll-jumbo" style={{
                        }}>

                            {/* <Row> */}
                            <Row>
                                <Col sm style={{ height: "fit-content" }}>
                                    <Form.Label >Title</Form.Label>
                                    <textarea
                                        className="form-text"
                                        type="text"
                                        maxLength={300}
                                        placeholder="What's the Occasion?"
                                        name="pollTitle"
                                        onChange={handlePollDetailsChange}
                                        style={{ height: "70px;" }}
                                    // style={{ height: "100px" }}
                                    />
                                </Col>
                                <Col sm style={{ height: "fit-content" }}>
                                    <Form.Label >Meeting Description</Form.Label>
                                    <textarea
                                        className="form-text"
                                        type="text"
                                        name="pollDescription"
                                        maxLength={500}
                                        placeholder="Here you can include things like agenda, instructions and other details"
                                        onChange={handlePollDetailsChange}
                                        style={{ height: "70px;" }}
                                    />
                                </Col>

                                <Col sm style={{ height: "fit-content" }}>
                                    <Form.Label >Location</Form.Label>
                                    <textarea
                                        className="form-text"
                                        type="text"
                                        name="pollLocation"
                                        maxLength={400}
                                        placeholder="Where will this happen?"
                                        onChange={handlePollDetailsChange}
                                        style={{ height: "70px;" }}
                                    />
                                </Col>
                                <Col sm style={{ height: "fit-content" }}>

                                    <Form.Label >Recurrence</Form.Label>
                                    <Form.Group controlId="recurring" style={{ marginTop: "12px" }}>
                                        <Form.Check
                                            name="recurring"
                                            type="switch"
                                            label="Does this event happen every week?"
                                            onChange={ontoggle}
                                        />

                                    </Form.Group> </Col>
                            </Row>


                            <Row>
                                {dropdown && <Col sm style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}> <FormControl className={classes.formControl} >
                                    <Form.Label >Frequency</Form.Label>
                                    <Select
                                        labelId="timezone-label"
                                        id="timezone-select"
                                        onChange={getrecurrance}
                                    >
                                        <MenuItem key={""} value="Daily" >
                                            Daily
                                        </MenuItem>
                                        <MenuItem key={""} value="Weekly" >
                                            Weekly
                                        </MenuItem>
                                        <MenuItem key={""} value="Monthly" >
                                            Monthly
                                        </MenuItem>

                                    </Select>
                                </FormControl> </Col>
                                }




                                {dropdown && dailytoggle && <Col sm style={{ display: "flex", alignItems: "center", marginBottom: "-29px" }} onChange={onChangeValue}>
                                    {/* <div onChange={onChangeValue}> */}
                                    <input type="radio" value="1" name="daysval" /> <label style={{ color: "black", padding: "5px", marginBottom: "0px" }}>Include Weekends</label>&nbsp;
                                    <input type="radio" value="2" name="daysval" /> <label style={{ color: "black", padding: "5px", marginBottom: "0px" }}>Exclude Weekends</label>
                                    {/* </div> */}
                                </Col>}
                                {dropdown && <Col sm style={{ display: "flex", alignItems: "center", marginBottom: "-29px" }}>
                                    <ThemeProvider theme={theme}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <CssBaseline />
                                            <HomePage />
                                        </MuiPickersUtilsProvider>
                                    </ThemeProvider>

                                </Col>}

                                {/* <Col sm style={{ top: "0px" }}>
                                    <ThemeProvider theme={theme}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <CssBaseline />
                                            <HomePage />
                                        </MuiPickersUtilsProvider>
                                    </ThemeProvider>

                                </Col> */}
                            </Row>

                            <Row>
                                <Col sm style={{ display: "flex" }}>
                                    <Button
                                        className="global-primary-button"
                                        onClick={handleSubmit}
                                        disabled={disabled}
                                        style={{ backgroundColor: "black" }}
                                    >
                                        {!disabled ? (
                                            `Confirm Slots`
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
                            {/* </Row> */}
                        </Jumbotron>
                        {recurrence && <Row>
                            <Col sm style={{ display: "flex", marginLeft: "400px" }}>
                                <Button
                                    className="global-primary-button"
                                    onClick={handleSubmit}
                                    disabled={disabled}
                                    style={{ color: "black" }}
                                >

                                    Recurrance start date :{(recurr_display) ? recurr_display : " -"}

                                </Button>
                            </Col>
                        </Row>}
                        <Jumbotron className="new-poll-timeslot-jumbo">
                            <OesCalendar pollTimes={pollTimes} setTimes={setTimes} recurr={recurrence ? recurrence : "week"} />
                        </Jumbotron>

                        <ToastContainer />
                    </Container>
                </div>
            </Layout>
        </>
    );
};

export default Meeting;
