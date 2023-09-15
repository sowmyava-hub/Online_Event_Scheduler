import React from "react";
import ReactDOM from "react-dom";
// import DateTimePicker from "./DateTimePicker";
//import TimeSelectionRange from "./TimeSelectionRange";
import AvailableTimes from "react-available-times";
// import fetch from "unfetch";
import Layout from "../src/components/Layout";

export default function calendar() {
    return <TimeSelectionRange />;
}
const currentDate = new Date();
const TimeSelectionRange = () => {
    let selectedDateTime = [];
    return (
        <Layout>
            <div
                style={{
                    display: "flex",
                    alignSelf: "flex-start",
                    maxHeight: "20px",
                    width: "100%",
                    fontSize: "18px",
                    textAlign: "center",
                    padding: "8px",
                    marginTop: "20px"
                }}
            >
                <AvailableTimes
                    weekStartsOn="monday"
                    onChange={(selections) => {
                        const validSelections = selections
                            .filter(
                                (selection) => selection.start != null && selection.end != null
                            )
                            .map(
                                (selection) =>
                                    "From " +
                                    selection.start.toDateString() +
                                    " at " +
                                    selection.start.toTimeString().slice(0, 8) +
                                    " until " +
                                    selection.end.toTimeString().slice(0, 8)
                            );
                        console.log("validSelections", validSelections);
                        selectedDateTime = [...validSelections];
                    }}
                    onEventsRequested={({ calendarId, start, end, callback }) => {
                        return true;
                    }}
                    initialSelections={[{ start: null, end: null }]}
                    recurring={false}
                    availableDays={[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday"
                    ]}
                // availableHourRange={{ start: 9, end: 19 }}
                />
                <button
                    style={{
                        position: "absolute",
                        top: "86px",
                        left: "5%",
                        padding: "0.7em",
                        borderRadius: "10px",
                        backgroundColor: "lightgray",
                        outline: "none",
                        border: "1px solid #BBB",
                        boxShadow: "none"
                    }}
                // onClick={() => sendAvailableDate_Time(selectedDateTime)}
                >
                    Confirm Slot
                </button>
            </div>
        </Layout>
    );
};
//export default TimeSelectionRange;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
