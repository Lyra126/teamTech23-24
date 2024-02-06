import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

// fix later

const Navbar = () => {
  return (
    <div className = "navbar">
        <div className = "links"> 
            <Link to="/front-end-map/">Home</Link>
            <Link to="/front-end-map/map">Map</Link>
            {/* <Link to="/front-end-app/calendar">Calendar</Link> */}
        </div>
    </div>
  )
}

export default Navbar