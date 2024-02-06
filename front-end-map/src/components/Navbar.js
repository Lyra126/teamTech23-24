import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

// sets up our navigation bar at the top of the page on every page
const Navbar = () => {
  return (
    <div className = "navbar">
        <div className = "links"> 
        {/* Creates live links to the calendar and map pages for the website */}
            <Link to="/front-end-map/">Home</Link>
            <Link to="/front-end-map/map">Map</Link>
            {/* <Link to="/front-end-app/calendar">Calendar</Link> */}
        </div>
    </div>
  )
}

export default Navbar