import { Scheduler } from "@aldabil/react-scheduler";
import { EVENTS } from "./events";
import Layout from "../src/components/Layout";
import { useRouter } from "next/router";
import { getMycalendar } from "../src/utils/api/server";
import UserProfile from './session';
import 'moment-timezone';
import moment from 'moment';

export default function homecalendar() {
    const events = [];
    const history = useRouter();
    getMycalendar(UserProfile.getId()).then(function (res) {
        if (res && res.data) {
            let c = 0;
            for (let k = 0; k < res.data.length; k++) {
                const meeting_name = res.data[k].title;
                for (let i = 0; i < res.data[k].recurr_event.length; i++) {
                    // let obj = {};
                    // obj.title = meeting_name;
                    // obj.start_month = new Date(res.data[k].times[i].start).getMonth() + 1;
                    // obj.end_month = new Date(res.data[k].times[i].end).getMonth() + 1;
                    // obj.start_date = new Date(res.data[k].times[i].start).getDate();
                    // obj.end_date = new Date(res.data[k].times[i].end).getDate();
                    // obj.year = new Date(res.data[k].times[i].start).getFullYear();
                    // obj.start_val = moment(res.data[k].times[i].start).format("hh:mm ");
                    // obj.end_val = moment(res.data[k].times[i].end).format("hh:mm ");
                    // let finalobj = {};
                    // c++;
                    // finalobj.event_id = c;
                    // finalobj.title = meeting_name;
                    // finalobj.start = new Date(obj.year + " " + obj.start_month + " " + obj.start_date + " " + obj.start_val);
                    // finalobj.end = new Date(obj.year + " " + obj.end_month + " " + obj.end_date + " " + obj.end_val);
                    // finalobj.color = "black";
                    // events.push(finalobj);
                    // if (res.data[k].recurr && res.data[k].recurr_endate) {
                    //     let day = new Date(res.data[k].times[i].start).getDay();

                    //     var start = new Date(res.data[k].times[i].start);
                    //     var end = new Date(res.data[k].recurr_endate);

                    //     var val = start.setDate(start.getDate() + 1);
                    //     var loop = new Date(val);
                    //     while (loop <= end) {
                    //         if (loop.getDay() == day) {

                    //             let obj = {};
                    //             obj.title = res.data[k].title;
                    //             obj.start_month = new Date(loop).getMonth() + 1;
                    //             obj.end_month = new Date(loop).getMonth() + 1;
                    //             obj.start_date = new Date(loop).getDate();
                    //             obj.end_date = new Date(loop).getDate();
                    //             obj.year = new Date(loop).getFullYear();
                    //             obj.start_val = moment(res.data[k].times[i].start).format("hh:mm ");
                    //             obj.end_val = moment(res.data[k].times[i].end).format("hh:mm ");
                    //             let finalobj = {};
                    //             c++;
                    //             finalobj.event_id = c;
                    //             finalobj.title = meeting_name;
                    //             finalobj.start = new Date(obj.year + " " + obj.start_month + " " + obj.start_date + " " + obj.start_val);
                    //             finalobj.end = new Date(obj.year + " " + obj.end_month + " " + obj.end_date + " " + obj.end_val);
                    //             finalobj.color = "black";
                    //             events.push(finalobj);


                    //         }
                    //         var newDate = loop.setDate(loop.getDate() + 1);
                    //         loop = new Date(newDate);
                    //     }

                    // }

                    let obj = {};
                    obj.start_month = new Date(res.data[k].recurr_event[i].start).getMonth() + 1;
                    obj.end_month = new Date(res.data[k].recurr_event[i].start).getMonth() + 1;
                    obj.start_date = new Date(res.data[k].recurr_event[i].start).getDate();
                    obj.end_date = new Date(res.data[k].recurr_event[i].start).getDate();
                    obj.year = new Date(res.data[k].recurr_event[i].start).getFullYear();
                    obj.start_val = moment(res.data[k].recurr_event[i].start).format("hh:mm ");
                    obj.end_val = moment(res.data[k].recurr_event[i].end).format("hh:mm ");

                    // let finalobj = {};
                    // c++;
                    // finalobj.event_id = c;
                    // finalobj.title = meeting_name;

                    //19th_may
                    // res.data[k].recurr_event[i].start = new Date(obj.year + " " + obj.start_month + " " + obj.start_date + " " + obj.start_val);
                    // res.data[k].recurr_event[i].end = new Date(obj.year + " " + obj.end_month + " " + obj.end_date + " " + obj.end_val);
                    //events.push(res.data[k].recurr_event[i]);


                    const startValDate = new Date(res.data[k].recurr_event[i].start);
                    const endValDate = new Date(res.data[k].recurr_event[i].end);

                    res.data[k].recurr_event[i].start = new Date(obj.year, obj.start_month - 1, obj.start_date, startValDate.getHours(), startValDate.getMinutes()),
                        res.data[k].recurr_event[i].end = new Date(obj.year, obj.end_month - 1, obj.end_date, endValDate.getHours(), endValDate.getMinutes()),
                        events.push(res.data[k].recurr_event[i]);
                }
            }


        }
        console.log(events);
        console.log(EVENTS);
    });
    return (
        <Layout>
            <button
                style={{

                    top: "66px",
                    left: "20%",
                    padding: "0.4em",
                    borderRadius: "10px",
                    backgroundColor: "black",
                    outline: "none",
                    border: "1px solid #BBB",
                    boxShadow: "none",
                    color: "white",
                    //marginLeft: "1360px"
                    marginLeft: "90%"
                }}
                onClick={() => history.push('/meeting')}
            >
                Create Meeting
            </button>
            <Scheduler
                view="month"
                events={events}
                editable={false}
                deletable={false}
                selectedDate={new Date()}
                week={{
                    weekDays: [0, 1, 2, 3, 4, 5],
                    weekStartOn: 6,
                    startHour: 0,
                    endHour: 23,
                    step: 60,
                }}
                day={{
                    startHour: 0,
                    endHour: 23,
                    step: 60,
                }}
            />
        </Layout>
    );
}
