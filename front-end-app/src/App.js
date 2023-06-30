import "./index.css";
import "./Events.js"
import { useState } from "react";
import Calendar from "./Calendar";
import Details from "./Details";
import logo from "./images/sweCaciLogo.png";
import ShowEvents from "./Event";


export default function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState(null);
  const showDetailsHandle = (dayStr) => {
    setData(dayStr);
    setShowDetails(true);
  };


  return (
    <div className="App">
     
      <h1>CACI Satellite Scheduler</h1>
       
      <Calendar showDetailsHandle={showDetailsHandle} />
      <br />
      
    <div className="Footer">
        <img src={logo} width={'100'}/>
</div>
    </div>
  
  );
}