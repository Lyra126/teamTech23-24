// Note: make sure to add css styling to allow for padding and search bar capability (Elle)
// Map Team - work on map here!

// Please make sure to write comments as you go to help with future reference
import React, {useRef, useEffect} from 'react'
// importing leaflet
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// importing css styling
import './Map.css'
// importing Icon to show satellite icon
import { Icon } from "leaflet";
import image1 from "../images/greensatellite.png"
import image2 from "../images/orangesatellite.png"
import image3 from "../images/yellowsatellite.png"


// here's the website I referenced to do this: 
// https://medium.com/@timndichu/getting-started-with-leaflet-js-and-react-rendering-a-simple-map-ef9ee0498202
// great guide for using the react-leaflet: https://react-leaflet.js.org/docs/example-popup-marker/

// Updating Map based on Search Results
/*const Map = ({ objectData }) => {
  useEffect(() => {
    // Update the map when objectData changes
    updateMap();
  }, [objectData]);

  const updateMap = () => {
    if (objectData) {
      // Assuming your objectData has 'startlat' and 'startlong' properties
      const { startlat, startlong } = objectData;

      // Use 'startlat' and 'startlong' to set the initial coordinates
      // For simplicity, let's assume a function setInitialCoordinates() updates the coordinates
      setInitialCoordinates(startlat, startlong);
    }
  };

  // const updateMarker = (latitude, longitude) => {
  //   // Implement the logic to update the marker on the map
  //   // For simplicity, let's assume there is a marker state or a function to set markers
  //   <Marker 
  //       position={[latitude, longitude]}
  //       icon = {satIcon} // Add icon for satellite
  //     />
  // };
  const setInitialCoordinates = (latitude, longitude) => {
    // Implement the logic to set the initial coordinates on the map
    // For simplicity, let's assume there's a function to set the map center
    setMapCenter([latitude, longitude]);
  };

  const initialLatitude = 40.7128;
  const initialLongitude = -74.0060;
  const [mapCenter, setMapCenter] = React.useState([initialLatitude, initialLongitude]);

  */

  const Map = ({ objectData }) => {
  const [mapCenter, setMapCenter] = React.useState([40.7128, -74.0060]); // Default center

  useEffect(() => {
    if (objectData) {
      const { startlat, startlong } = objectData;
      setMapCenter([startlat, startlong]);
    }
  }, [objectData]);

  // const latitude = 51.505;
  // const longitude = -0.09;
  
  // icon
  const greensatIcon = new Icon({
    iconUrl: image1,
    // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
    iconSize: [25, 25]
  });

  const orangesatIcon = new Icon({
    iconUrl: image2,
    // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
    iconSize: [25, 25]
  });

  const yellowsatIcon = new Icon({
    iconUrl: image3,
    // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
    iconSize: [25, 25]
  });

  const mapRef = useRef(null);

  useEffect(() => {
    let mapInstance = null;

    if (mapRef.current) {
      mapInstance = mapRef.current.leafletElement;
      mapInstance.on("moveend", updateMarkers); // event fired when the map completes a move, triggering the action to update markers
      updateMarkers();
    }

    return () => {
      if (mapInstance) {
        mapInstance.off("moveend", updateMarkers);
      }
    };
  }, []);

  const updateMarkers = () => {
    if (mapRef.current){
      const map = mapRef.current.leafletElement;

      const bounds = map.getBounds();
      const newMarkers = [
        { position: [27.2256, -82.2608], icon: greensatIcon},
        { position: [30.26666, -97.73830], icon: orangesatIcon },
        { position: [35.652832, 139.839478], icon: yellowsatIcon }
      ];
      newMarkers.forEach(({ position, icon }) => {
        if (bounds.contains(position)) {
          new Marker(position, { icon }).addTo(map);
        }
      });
    }
  };

  // const satIcon = new Icon({
  //   iconUrl: image3,
  //   // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
  //   iconSize: [25, 25]
  // });


  
  return (
    <div className='map'>
      {/* // Make sure you set the height and width of the map container otherwise the map won't show */}
      <MapContainer center={mapCenter} zoom={4} ref={mapRef} style={{height: "80vh", width: "60vw"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Additional map layers or components can be added here */}
      {/* Add one test point at center of map, can edit to add satellite point with lat and lon from dataset */}
      {/* <Marker 
        position={[latitude, longitude]}
        icon = {satIcon} // Add icon for satellite
      /> */}
      <Marker // Marker for Sarasota
        position={[27.2256, -82.2608]} 
        icon = {greensatIcon}
      />
      <Marker // Marker for Austin
        position={[30.26666, -97.73830]}
        icon = {orangesatIcon}
      />
      <Marker // Marker for Tokyo
        position={[35.652832, 139.839478]} // FIXTHIS only showing on half of map rn 
        icon = {yellowsatIcon}
      />

      <Polyline // Line connecting Sarasota and Austin
        pathOptions={{color: 'blue'}}
        positions={[
          [27.2256, -82.2608], 
          [30.26666, -97.73830],
        ]}
      />
      

      </MapContainer>
    </div>   
  )
}

export default Map
