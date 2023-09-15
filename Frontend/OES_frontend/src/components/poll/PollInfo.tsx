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
import CopyText from "../copyText";

dayjs.extend(localizedFormat);
dayjs.extend(timezone);

const PollInfo = (props: {
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
      {!poll.open && showFinalTime && (
        <span className="poll-info-detail-title">
          <CalendarCheck className="poll-info-icon" />
          {dayjs(poll.finalTime?.start).format("ddd")},{" "}
          {dayjs(poll.finalTime?.start).format("MMM")}{" "}
          {dayjs(poll.finalTime?.start).format("DD")},{" "}
          {dayjs(poll.finalTime?.start).format("LT")} -{" "}
          {dayjs(poll.finalTime?.end).format("LT")}
        </span>
      )}
      {showCopyBox && (
        <>
          <span className="poll-info-detail-title copy-text-mobile">
            <ShareFill className="poll-info-icon" />
            <CopyText
              pollTitle={poll.title}
              pollID={poll._id}
              pollLocation={poll.location}
              finalTime={poll.finalTime}
              isparticipant="0"
            />
          </span>
        </>
      )}
      {showCopyBox && (
        <>
          <span className="poll-info-detail-title copy-text-desktop">
            <ShareFill className="poll-info-icon" />
            Share this{" "}
            <CopyText
              pollTitle={poll.title}
              pollID={poll._id}
              pollLocation={poll.location}
              finalTime={poll.finalTime}
              isparticipant="0"
            />{" "}
            with Initiator
          </span>
        </>
      )}

      {showCopyBox && (
        <>
          <span className="poll-info-detail-title copy-text-mobile">
            <ShareFill className="poll-info-icon" />
            <CopyText
              pollTitle={poll.title}
              pollID={poll._id}
              pollLocation={poll.location}
              finalTime={poll.finalTime}
              isparticipant="1"
            />
          </span>
        </>
      )}
      {showCopyBox && (
        <>
          <span className="poll-info-detail-title copy-text-desktop">
            <ShareFill className="poll-info-icon" />
            Share this{" "}
            <CopyText
              pollTitle={poll.title}
              pollID={poll._id}
              pollLocation={poll.location}
              finalTime={poll.finalTime}
              isparticipant="1"
            />{" "}
            with the participants
          </span>
        </>
      )}

    </div>
  );
};

export default PollInfo;
