import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import "./index.css";
import "./Events.js"
import { useState } from "react";
import Calendar from "./Calendar";
import Details from "./Details";
import logo from "./images/sweCaciLogo.png";
import ShowEvents from "./Event";
import Map from "./Components/Map.js";


function App () {
  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState(null);
  const showDetailsHandle = (dayStr) => {
    setData(dayStr);
    setShowDetails(true);
  };

  console.log("calendar should show");


  return (
    <Router>
      <div className="App">
      <h1>CACI Satellite Scheduler</h1>
        <Routes>
          <Route path="/" exact element={<Calendar showDetailsHandle={showDetailsHandle} />}></Route>
          <Route path="/map" element={<Map/>}/>
        </Routes>
        
          
        <br />
        <div className="Footer">
            <img src={logo} width={'100'}/>
        </div>
      </div>
    </Router>
    
  );
}

export default App;