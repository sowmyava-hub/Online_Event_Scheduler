import React from "react";
import ScheduleSelector from "react-schedule-selector";
import Layout from './Layout';
import { Row, Col, Form, Button } from 'react-bootstrap';

class App extends React.Component {
  state = { schedule: [] };

  handleChange = (newSchedule) => {
    this.setState({ schedule: newSchedule });
  };

  render() {
    return (
      <div className="App" >
         <Layout>
        <h1>Please select your available slots:</h1>
        <ScheduleSelector
        selection={this.state.schedule}
        numDays={5}
        minTime={0}
        maxTime={24}
        hourlyChunks={1}
        onChange={this.handleChange}
      />
      <Button>
            Create Poll and Continue </Button>
      </Layout>
      
      </div>
      
    );
  }
}

export default App;
