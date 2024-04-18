import "./index.css";
import "./Events.js"
import { useState } from "react";
import Calendar from "./Calendar";
import Details from "./Details";
import logo from "./images/sweCaciLogo.png";
import ShowEvents from "./Event";
import {Navbar, timeZone, location} from "./components/Navbar"
import { GiHamburgerMenu } from "react-icons/gi";

export default function App() {
    const [showDetails, setShowDetails] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [data, setData] = useState(null);
    const [time, setTime] = useState(timeZone);
    const [loc, setLocation] = useState(location);
    const showDetailsHandle = (dayStr) => {
        setData(dayStr);
        setShowDetails(true);
    };

return (
    <div className="App">
        <header>
            <GiHamburgerMenu onClick={() => setShowNav(!showNav)}/>
            <h4> Additional Preferences </h4>
        </header>
        {<Navbar />}
            <h1>CACI Satellite Scheduler</h1>
            <Calendar time = {time} location = {loc} showDetailsHandle={showDetailsHandle} />
        <Navbar show={showNav} setTime = {setTime} setLocation={setLocation}/>
        <div className="Footer">
            <img src={logo} width={'100'}/>
        </div>
    </div>

);
}