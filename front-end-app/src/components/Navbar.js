import React, { useState } from 'react';
import PropTypes from "prop-types";
import './Navbar.css';
import { Link } from 'react-router-dom';
export let timeZone = "UTC"; // Export timeZone directly
export let location = "Tampa, Florida"; // Export location directly

export const Navbar = ({ show }) => {
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
  };

  const handleClickEST = () => {
    timeZone = "UTC-05"; // Update timeZone directly
  };

  const handleClickPST = () => {
    timeZone = "UTC-08"; // Update timeZone directly
  };

  const handleClickTF = () => {
    location = "Tampa, Florida"; // Update location directly
  };

  const handleClickTJ = () => {
    location = "Tokyo, Japan"; // Update location directly
  };

  const handleClickAT = () => {
    location = "Austin, Texas"; // Update location directly
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
            <Link to="/map"><b>Map</b></Link>
          </a>
        </li>
        <li>
          <a onClick={() => toggleAccordion('download')}>
          <a
            href={process.env.PUBLIC_URL + "/satelliteSchedule.json"}
            download="satelliteSchedule.json"
          >
            <b>Download</b>
          </a>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
