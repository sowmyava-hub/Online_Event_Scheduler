import { Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import Router from "next/router";
import { ToastContainer, toast } from "react-toastify";
import toastOptions from "../../helpers/toastOptions";
import { markmeetingTimes } from "../../utils/api/server";
import { Recevent, PollFromDB } from "../../models/poll";
import { isUserPresentInVotes } from "../../helpers";
import { ScheduleMeeting } from 'react-schedule-meeting';

const SubmitTimes = (props: {
    newVote: Recevent;
    pollID: string;
    pollFromDB: PollFromDB;
}): JSX.Element => {
    const { newVote, pollID, pollFromDB } = props;

    const [disabled, setDisabled] = useState<boolean>(false);

    const handleSubmit = async (
        e: React.MouseEvent<HTMLInputElement>
    ): Promise<void> => {
        e.preventDefault();

        if (newVote.recurr_event.length === 0) {
            toast.error("Please select at least one time slot", toastOptions);

            return;
        }

        setDisabled(true);
        try {
            let submitTimeResponse;
            const voterArgs = {
                newVote,
                pollID,
            };
            console.log(voterArgs);
            //   {
            //     "newVote": {
            //         "name": "test",
            //         "times": [
            //             {
            //                 "start": 1681880400000,
            //                 "end": 1681881300000,
            //                 "_id": "643d5e3275d07c6906f08f33"
            //             }
            //         ]
            //     },
            //     "pollID": "643d5e3275d07c6906f08f32"
            // }
            // {
            //     "newVote": {
            //         "recurr_event": [
            //             {
            //                 "event_id": 1,
            //                 "title": "goog",
            //                 "start": "2023-04-19T05:00:00.000Z",
            //                 "end": "2023-04-19T05:15:00.000Z",
            //                 "status": 0,
            //                 "color": "black",
            //                 "_id": "643d5e3275d07c6906f08f35"
            //             },
            //             {
            //                 "event_id": 2,
            //                 "title": "goog",
            //                 "start": "2023-04-26T05:00:00.000Z",
            //                 "end": "2023-04-26T05:15:00.000Z",
            //                 "status": 1,
            //                 "color": "black",
            //                 "_id": "643d5e3275d07c6906f08f36"
            //             },
            //             {
            //                 "event_id": 3,
            //                 "title": "lkasdw",
            //                 "start": "2023-04-20T05:30:00.000Z",
            //                 "end": "2023-04-20T05:45:00.000Z",
            //                 "status": 1,
            //                 "color": "green",
            //                 "_id": "643d5e3275d07c6906f08f37"
            //             },
            //             {
            //                 "event_id": 4,
            //                 "title": "goog",
            //                 "start": "2023-04-27T05:30:00.000Z",
            //                 "end": "2023-04-27T05:45:00.000Z",
            //                 "status": 0,
            //                 "color": "black",
            //                 "_id": "643d5e3275d07c6906f08f38"
            //             }
            //         ]
            //     },
            //     "pollID": "643d5e3275d07c6906f08f32"
            // }
            submitTimeResponse = await markmeetingTimes(voterArgs);
            if (submitTimeResponse && submitTimeResponse.statusCode === 201) {
                console.log("success");
                // if (typeof window !== "undefined") {
                //     const votedPolls = localStorage.getItem("kukkeeVotedPolls");

                //     if (!votedPolls) {
                //         const initKukkeePolls = {
                //             polls: [
                //                 {
                //                     [`${pollID}`]: `${pollFromDB.title}`,
                //                 },
                //             ],
                //         };

                //         localStorage.setItem(
                //             "kukkeeVotedPolls",
                //             JSON.stringify(initKukkeePolls)
                //         );
                //     } else {
                //         const votedPollsJSON = JSON.parse(votedPolls);

                //         votedPollsJSON.polls.push({
                //             [`${pollID}`]: `${pollFromDB.title}`,
                //         });

                //         localStorage.setItem(
                //             "kukkeeVotedPolls",
                //             JSON.stringify(votedPollsJSON)
                //         );
                //     }
                // }
                // Router.reload();
            } else if (submitTimeResponse && submitTimeResponse.statusCode === 404) {
                toast.error("The poll has been deleted by the creator", toastOptions);
                //Router.push("/");
            } else if (submitTimeResponse && submitTimeResponse.statusCode === 400) {
                toast.error("The poll has been closed by the creator", toastOptions);
                //Router.reload();
            } else {
                setDisabled(false);
                toast.info("Please try again later", toastOptions);
                Router.reload();
            }
        } catch (err) {
            setDisabled(false);
            toast.info("Please try again later", toastOptions);
        }
    };

    return (
        <>
            <Button
                className="global-primary-button mb-5"
                type="submit"
                disabled={disabled}
                onClick={handleSubmit}
            >
                {!disabled ? (
                    `Book your slots`
                ) : (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="kukkee-button-spinner"
                        />
                    </>
                )}
            </Button>
            <ToastContainer />
        </>
    );
};

export default SubmitTimes;
