import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import "./index.css";
import "./Events.js"
import { useState } from "react";
import Calendar from "./Calendar";
import Details from "./Details";
import logo from "./images/sweCaciLogo.png";
import ShowEvents from "./Event";
import Map from "./components/Map.js";
import {Navbar, timeZone, location} from "./components/Navbar"
import { GiHamburgerMenu } from "react-icons/gi";

function App () {
    const [showDetails, setShowDetails] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [data, setData] = useState(null);
    const [time, setTime] = useState(timeZone);
    const [loc, setLocation] = useState(location);
    const showDetailsHandle = (dayStr) => {
        setData(dayStr);
        setShowDetails(true);
    };

    const cal = () => {
      return(
        <div>
          <header>
            <GiHamburgerMenu onClick={() => setShowNav(!showNav)}/>
            <h4> Additional Preferences </h4>
          </header>
          {<Navbar/>}
          <Calendar showDetailsHandle={showDetailsHandle} />
          <Navbar show={showNav}/>
        </div>
        
      )
    }
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={
            <div>
              <header>
                <GiHamburgerMenu onClick={() => setShowNav(!showNav)}/>
                <h4> Additional Preferences </h4>
              </header>
              {<Navbar/>}
              <h1>CACI Satellite Scheduler</h1>
              <Calendar time = {time} location = {loc} showDetailsHandle={showDetailsHandle}/>
              <Navbar show={showNav} setTime = {setTime} setLocation={setLocation}/>
            </div>}></Route>
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