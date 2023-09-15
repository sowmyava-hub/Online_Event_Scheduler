import { NextApiRequest, NextApiResponse } from "next";
import OesPoll, { Vote, PollDoc, Recevent } from "../../../src/models/poll";
import { isTimePresentInPollTimes } from "../../../src/helpers";
import connectToDatabase from "../../../src/utils/db";

export default async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    const {
        query: { id },
        method,
        body,
    } = req;

    switch (method) {
        case "GET":
            try {
                await connectToDatabase();
                const poll: PollDoc[] | null = await OesPoll.find({
                    userid: id,
                }).lean();
                if (!poll) {
                    res.status(404).json({ message: "Poll does not exist" });
                } else {
                    res.status(200).json(poll);
                }
            } catch (err) {
                console.log(err);
                res.status(404).json({ message: err.message });
            }
            break;
        // case "PUT":
        //     try {
        //         await connectToDatabase();
        //         const poll: PollDoc | null = await OesPoll.findOne({
        //             _id: id,
        //         });
        //         if (poll) {
        //             const vote: Vote = JSON.parse(body);
        //             if (!poll.open) {
        //                 res.status(400).json({ message: "Poll closed" });
        //             } else if (
        //                 !vote.times.every((time) =>
        //                     isTimePresentInPollTimes(time, poll.times)
        //                 )
        //             ) {
        //                 res.status(400).json({ message: "Invalid times" });
        //             } else {
        //                 const currentVotes: Vote[] | undefined = poll.votes;
        //                 let newVotes: Vote[] | undefined;

        //                 if (currentVotes && currentVotes?.length > 0) {
        //                     newVotes = currentVotes;
        //                     newVotes.push(vote);
        //                 } else {
        //                     newVotes = [
        //                         {
        //                             name: vote.name,
        //                             times: vote.times,
        //                         },
        //                     ];
        //                 }
        //                 const updatedPoll: PollDoc | null = await OesPoll.findOneAndUpdate(
        //                     { _id: id },
        //                     { votes: newVotes },
        //                     { new: true }
        //                 );
        //                 res.status(201).json(updatedPoll);
        //             }
        //         } else {
        //             res.status(404).json({ message: "Poll does not exist" });
        //         }
        //     } catch (err) {
        //         res.status(400).json({ message: err.message });
        //     }
        //     break;
        // default:
        //     res.setHeader("Allow", ["GET", "PUT"]);
        //     res.status(405).end(`Method ${method} Not Allowed`);
        case "PUT":
            try {
                await connectToDatabase();
                const poll: PollDoc | null = await OesPoll.findOne({
                    _id: id,
                });
                if (poll) {
                    const vote: Recevent = JSON.parse(body);

                    if (!poll.open) {
                        res.status(400).json({ message: "Poll closed" });
                    } else {
                        const currentVotes: Recevent[] | undefined = poll.recurr_event;
                        let newVotes: Recevent[] | undefined;


                        // if (currentVotes && currentVotes?.length > 0) {
                        //     newVotes = currentVotes;
                        //     newVotes.push(vote);
                        // } else {
                        //     newVotes = [
                        //         {
                        //             recurr_event: vote.recurr_event,
                        //         },
                        //     ];
                        // }
                        const updatedPoll: PollDoc | null = await OesPoll.findOneAndUpdate(
                            { _id: id },
                            { recurr_event: vote.recurr_event },
                            { new: true }
                        );
                        res.status(201).json(updatedPoll);
                    }
                } else {
                    res.status(404).json({ message: "Poll does not exist" });
                }
            } catch (err) {
                res.status(400).json({ message: err.message });

            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
