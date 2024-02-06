// Map Team
// work on map here!

// Please make sure to write comments as you go to help with future reference
import React from 'react'

const Map = () => {
  return (
    // Include Leaflet CSS and JavaScript file
    <div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""/>

      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""></script>
          <div className='map'>
          </div>
    </div>
  )
}

export default Map
