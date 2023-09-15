import { Badge } from "react-bootstrap";
import { CalendarCheck, GeoAltFill, Globe } from "react-bootstrap-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import { PollFromDB } from "../../models/poll";

dayjs.extend(localizedFormat);
dayjs.extend(timezone);

const PollInfo = (props: {
  poll: PollFromDB;
  showFinalTime: boolean;
}): JSX.Element => {
  const { poll, showFinalTime } = props;
  // const recurrEventsStringArray = poll.recurr_event.map(event => JSON.stringify(event));
  // const firstRecurrEventString = recurrEventsStringArray[0];
  // const firstRecurrEventObject = JSON.parse(firstRecurrEventString);
  // const firstEventId = firstRecurrEventObject.event_id;
  // const firstTitle = firstRecurrEventObject.title;
  return (
    <div>
      <Badge
        pill
        variant={poll.open ? "success" : "secondary"}
        className={
          poll.open
            ? "voter-page-poll-badge-open"
            : "voter-page-poll-badge-closed"
        }
      >
        {poll.open ? "Open" : "Closed"}
      </Badge>
      {poll.title && (
        <span className="voter-page-poll-info-title">Meeting Title : {poll.title}</span>
      )}
      {!poll.title && (
        <span className="voter-page-poll-info-title">Untitled</span>
      )}
      {poll.description && (
        <span className="voter-page-poll-info-desc">Meeting Description: {poll.description}</span>
      )}
      {poll.location && (
        <span className="voter-page-poll-info-detail-title">
          <GeoAltFill className="voter-page-poll-info-icon" />
          {poll.location}
        </span>
      )}



    </div>
  );
};

export default PollInfo;
