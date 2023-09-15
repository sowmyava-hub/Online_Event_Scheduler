import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home, NotFound,Main } from ".";
import EventDetail from "./event-detail";
import Poll from "./Poll";

export default function BrowserRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route  exact path="/Poll" component={Poll} />
        <Route  exact path="/Meeting" component={Home} />
        <Route path="/event/:id" component={EventDetail} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}
