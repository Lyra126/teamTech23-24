import React, { useState } from 'react';
import './Navbar.css';
export let timeZone = "UTC"; // Export timeZone directly
export let location = "Tampa, Florida"; // Export location directly

export const Navbar = ({ show, setTime, setLocation }) => {
  const [accordionState, setAccordionState] = useState({
    changeGroundStation: false,
    changeTimeZone: false,
    expirationDate: false,
    frequency: false,
    download: false,
    openMap: false
  });

  const toggleAccordion = (section) => {
    setAccordionState({
      ...accordionState,
      [section]: !accordionState[section]
    });
  };

  const handleClickUTC = () => {
    timeZone = "UTC"; // Update timeZone directly
    setTime(timeZone);
  };

  const handleClickEST = () => {
    timeZone = "UTC-05"; // Update timeZone directly
    setTime(timeZone);
  };

  const handleClickPST = () => {
    timeZone = "UTC-08"; // Update timeZone directly
    setTime(timeZone);
  };

  const handleClickTF = () => {
    location = "Tampa, Florida"; // Update location directly
    setLocation(location);
  };

  const handleClickTJ = () => {
    location = "Tokyo, Japan"; // Update location directly
    setLocation(location);
  };

  const handleClickAT = () => {
    location = "Austin, Texas"; // Update location directly
    setLocation(location);
  };

  return (
    <div className={show ? 'sidenav active' : 'sidenav'}>
      <ul>
        <li>
          <a onClick={() => toggleAccordion('changeGroundStation')}>
            <b>Ground Station</b>
          </a>
          {accordionState.changeGroundStation && (
            <div className="accordion-content">
              <a onClick={handleClickTF}>Tampa, Florida</a>
              <a onClick={handleClickTJ}>Tokyo, Japan</a>
              <a onClick={handleClickAT}>Austin, Texas</a>
            </div>
          )}
        </li>
        <li>
          <a onClick={() => toggleAccordion('changeTimeZone')}>
            <b>Time Zone</b>
          </a>
          {accordionState.changeTimeZone && (
            <div className="accordion-content">
              <a onClick={handleClickUTC}>UTC</a>
              <a onClick={handleClickEST}>EST (UTC-05)</a>
              <a onClick={handleClickPST}>PST (UTC-08)</a>
            </div>
          )}
        </li>
        <li>
          <a onClick={() => toggleAccordion('openMap')}>
            <b>Map</b> 
          </a>
        </li>
        <li>
          <a onClick={() => toggleAccordion('download')}>
            <button>Download</button>
          </a>
        </li>
      </ul>
    </div>
  );
};

function Navibar(props) {
  return Navbar;
}

export default Navbar;
