// Note: make sure to add css styling to allow for padding and search bar capability (Elle)
// Map Team - work on map here!

// Please make sure to write comments as you go to help with future reference
import React, {useRef} from 'react'
// importing leaflet
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// importing css styling
import './Map.css'

// here's the website I referenced to do this: 
// https://medium.com/@timndichu/getting-started-with-leaflet-js-and-react-rendering-a-simple-map-ef9ee0498202
// great guide for using the react-leaflet: https://react-leaflet.js.org/docs/example-popup-marker/

const Map = () => {
  const mapRef = useRef(null);
  const latitude = 51.505;
  const longitude = -0.09;
  return (
    <div className='map'>
      {/* // Make sure you set the height and width of the map container otherwise the map won't show */}
      <MapContainer center={[latitude, longitude]} zoom={2} ref={mapRef} style={{height: "80vh", width: "60vw"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Additional map layers or components can be added here */}
      </MapContainer>
    </div>
 
  // can delete this code below
    // Include Leaflet CSS and JavaScript file -> this is using hmtl
    // <div>
    //   {/* <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    //       integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    //       crossorigin=""/>

    //   <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    //       integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    //       crossorigin=""></script> */}
    //       {/* the container where the map will be loaded */}
    //       <div id="map">
    //         <map/>
    //       </div>
    // </div>

    
  )



}

export default Map
