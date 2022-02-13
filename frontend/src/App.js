import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import StreetNode from "./components/StreetNode";
import Nodes from "./components/Nodes";
import { Scheduler } from "./components/Scheduler";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Nodes} />
        <Route path="/node/:id" component={StreetNode} />
        <Route path="/scheduler" component={Scheduler}></Route>
      </Switch>
    </Router>
  );
}

export default App;
