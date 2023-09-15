import { Badge } from "react-bootstrap";
import {
    CalendarCheck,
    GeoAltFill,
    Globe,
    ShareFill,
} from "react-bootstrap-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import { PollFromDB } from "../../models/poll";
import CopyText2 from "../copyText2";
import utc from "dayjs/plugin/utc";
import React from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);



dayjs.extend(localizedFormat);
dayjs.extend(timezone);
const formatTime = (time: string): string => {
    const date = new Date(time);
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

const MeetingInfo = (props: {
    poll: PollFromDB;
    showFinalTime: boolean;
    showCopyBox: boolean;
}): JSX.Element => {
    const { poll, showFinalTime, showCopyBox } = props;
    return (
        <div>
            <Badge
                pill
                variant={poll.open ? "success" : "secondary"}
                className={poll.open ? "poll-badge-open" : "poll-badge-closed"}
            >
                {poll.open ? "Open" : "Closed"}
            </Badge>
            {poll.title && <span className="poll-info-title">{poll.title}</span>}
            {!poll.title && <span className="poll-info-title">Untitled</span>}
            {poll.description && (
                <span className="poll-info-desc">{poll.description}</span>
            )}
            {poll.location && (
                <span className="poll-info-detail-title">
                    <GeoAltFill className="poll-info-icon" />
                    {poll.location}
                </span>
            )}
            <span className="poll-info-detail-title">
                <Globe className="poll-info-icon" />
                Times are shown in: {dayjs.tz.guess()} timezone
            </span>
            {/* {!poll.open && showFinalTime && (
                <span className="poll-info-detail-title">
                    <CalendarCheck className="poll-info-icon" />
                    {dayjs(poll.finalTime?.start).format("ddd")}

                </span>
            )} */}
            {/* {poll.recurr_event && poll.recurr_event.length > 0 && (
                <div className="poll-info-detail-title">

                    <ul className="poll-info-recurring-events-list">
                        {poll.recurr_event.map((event) => (
                            <li key={event._id}>
                                <span>
                                    Slot {event.event_id}: {formatTime(event.start)} - {formatTime(event.end)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
            } */}
            {poll.recurr_event && poll.recurr_event.length > 0 && (
                <div className="poll-info-detail-title">
                    <table className="poll-info-recurring-events-table">
                        <thead>
                            <tr>
                                <th>Slot</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {poll.recurr_event.map((event, index) => {
                                const start = new Date(event.start);
                                const end = new Date(event.end);
                                const startTime = start.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
                                const endTime = end.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
                                return (
                                    <tr key={event._id}>
                                        <td>Slot {index + 1}</td>
                                        <td>{startTime}</td>
                                        <td>{endTime}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <style jsx>{`
      .poll-info-recurring-events-table {
        border-collapse: collapse;
        width: 100%;
      }
      .poll-info-recurring-events-table th,
      .poll-info-recurring-events-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
      }
      .poll-info-recurring-events-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .poll-info-recurring-events-table tr:nth-child(even) {
        background-color: #f2f2f2;
      }
    `}</style>
                </div>
            )}





            {
                showCopyBox && (
                    <>
                        <span className="poll-info-detail-title copy-text-mobile">
                            <ShareFill className="poll-info-icon" />
                            <CopyText2
                                pollTitle={poll.title}
                                pollID={poll._id}
                                pollLocation={poll.location}
                                finalTime={poll.finalTime}
                                isparticipant="0"
                            />
                        </span>
                    </>
                )
            }

            {
                showCopyBox && (
                    <>
                        <span className="poll-info-detail-title copy-text-mobile">
                            <ShareFill className="poll-info-icon" />
                            <CopyText2
                                pollTitle={poll.title}
                                pollID={poll._id}
                                pollLocation={poll.location}
                                finalTime={poll.finalTime}
                                isparticipant="1"
                            />
                        </span>
                    </>
                )
            }
            {
                showCopyBox && (
                    <>
                        <span className="poll-info-detail-title copy-text-desktop">
                            <ShareFill className="poll-info-icon" />
                            Share this{" "}
                            <CopyText2
                                pollTitle={poll.title}
                                pollID={poll._id}
                                pollLocation={poll.location}
                                finalTime={poll.finalTime}
                                isparticipant="1"
                            />{" "}
                            with the participants
                        </span>
                    </>
                )
            }

        </div >
    );
};

export default MeetingInfo;
