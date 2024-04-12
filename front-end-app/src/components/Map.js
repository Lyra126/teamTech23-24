// Note: make sure to add css styling to allow for padding and search bar capability (Elle)
// Map Team - work on map here!

// Please make sure to write comments as you go to help with future reference
import React, {useRef, useEffect, useState} from 'react'
// importing leaflet
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// importing css styling
import './Map.css'
// importing Icon to show satellite icon
import { Icon, marker } from "leaflet";
import image1 from "../images/greensatellite.png"
import image2 from "../images/orangesatellite.png"
import image3 from "../images/yellowsatellite.png"

// Search Imports
import TextField from "@mui/material/TextField";
// import dummySatellites from './DummyData';
import DatePicker from 'react-datepicker';
import { addDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchBar.css';
import { Button } from '@mui/material';

// Map and Search Page
const Map = () => {
  // Satellite Element Variable
  const [satellite, setSatellite] = useState({name: "", startTime: "", endTime: "", startLat: "", startLong: "", endLat: "", endLong: ""});
  // Search Bar Functions & Variables
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // date picker code
  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState('');
  const [satelliteList, setSatelliteList] = useState([]);

  // updates searchText when input to textfield changes
  const handleSearchChange = (event) => {
    console.log('change');
    setError('');
    setSearchText(event.target.value.trim());
  };
  
  // performs search when user press enter key on keyboard
  // might change to a button to make it more easier for the user to use and understand
  const handleKeyDown = () => {
    performSearch();
  };
  
  // performs search through database to idenitify potential satellites of the same date or id
  const performSearch = () => {
    // setError('');
    console.log('perfom');
    if (validInput(searchText.trim())) {
      const date = formatDate();
      console.log('Filter Date: ', date);
      if(searchText === '') {
        // NEED TO FIGURE OUT WHAT TO REPLACE FILTER WITH AS I CAN'T USE IT WITH THE DATABASE
        // OR SOMETHING IS OFF
        const filteredSatellites = satelliteList.filter((satellite) =>
          satellite.startTime.substring(0, 10).includes(date)
        );
        setSearchResults(filteredSatellites);
        console.log(searchResults);
      } else {
        // Perform the search logic based on searchText
        const filteredSatellites = satellite.filter((satellite) =>
          satellite.name.toLowerCase().includes(searchText.trim().toLowerCase()) && satellite.startTime.substring(0, 10).includes(date)
        );
        setSearchResults(filteredSatellites);
      }
      validResults();
      console.log('Search Results Satellites: ', searchResults);
    } else {
      setError('Invalid Satellite ID Input. Please Try Again.');
    }
    
  }; 

  // validating the search results
  const validResults = () => {
    if(searchResults.length === 0 && searchText !== '') {
      setError('No Satellites Found For Given ID and/or Date.');
    } else {
      setError('');
    }
    if (searchResults.length === 1) {
      // set satellite variable to be used in map to get the latitudes and longitudes to plot
      setSatellite(searchResults[0]);
      console.log('Set Satellite', satellite);
    }
  }
  // validating user input
  const validInput = (searchInput) => {
    return searchInput === '' || /^\d{1,5}$/.test(searchInput);
  };

  // formating date received to allow it to be compared to the one in the database
  const formatDate = () => {
    const year = String(startDate.getFullYear());
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    // const hour = startDate.getHours() + 1;
    console.log(year+'-'+month+'-'+day);
    return `${year}-${month}-${day}`;
  };

  // helps when user selects from our list
  const handleResultSelect = (result) => {
    console.log('Selected Result:', result); // Log the selected result
    setSearchText(result.name); // sets search bar value with the selected satellite's name
    setSearchResults([result]); // sets searchresults = to the satellite selected
    setSatellite(result);
    // set satellite variable to specific instant
    console.log('SearchResults Current: ', searchResults);
    console.log('Set Satellite to: ', satellite);
  };

  // ensures error status is being updated continuously
  useEffect(() => {
    if(validInput(searchText)) {
      setError('');
      if(searchText !== '' && searchText.length === 5) {
        if (searchResults.length === 0) {
          setError('No Satellites Found For Given ID and Date Combo');
        }
      } 
    } else {
      setError('Invalid Satellite ID Input. Please Try Again.')
    }
    
  }, [searchText, searchResults]);

  // ensures that performSearch is called whenever searchText or startDate is changed
  useEffect(() => {
    setError('');
  }, [searchText, startDate]);

  useEffect(() => {
    if (searchResults === 1) {
      setSatellite(searchResults[0]);
    }
  }, [searchResults]);

  // Map Functions & Variables
  const [mapCenter, setMapCenter] = React.useState([0.0, 0.0]); // Default center
  
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

  useEffect(() => {
    setMapCenter(0.0, satellite.startLong);
  }, [satellite])

  // const satIcon = new Icon({
  //   iconUrl: image3,
  //   // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
  //   iconSize: [25, 25]
  // });

  // GETTING DATA FROM DATABASE
  useEffect(() => {
    async function getItems() {
      const response = await fetch("http://localhost:8080/api/satellite");
      const newSatellite = await response.json();
      setSatelliteList(newSatellite);
      // console.log("sat items", satelliteList);
    }
    getItems();
  }, [satelliteList]);

  return (
    <div className='overall'>
      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="SearchBar">
          <TextField
            style={{
              width:'200px'
            }}
            value={searchText}
            onChange={handleSearchChange}
            label="Search"
            variant="outlined"
            fullWidth
            error={!!error}
            helperText={error}
          />
        </div>
        {searchResults.length > 1 && (<div className="result-overlay" style={{
            // styling the auto filter of the search bar
              position: 'absolute',
              top: '150px',
              left: '10px',
              width: '30%',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: '2000'}}>
            <ul>
              {searchResults.map(result => (
                <li key={result.name} onClick={() => handleResultSelect(result)}>
                  {result.name} {result.startTime}
                </li>
              ))}
            </ul>
          </div>)} 
        {/* DATE FILTER OPTION */}
        <div className='datepick'>
          <DatePicker 
            selected={startDate} 
            onChange={(date) => setStartDate(date)} 
            // showTimeSelect
            // timeFormat="HH:mm"
            // timeIntervals={60}
            // timeCaption="time"
            // maxDate={addDays(new Date(), 7)}
            // minDate={new Date()}
          />        
        </div>
        <div className='SearchButton'>
          <Button 
            variant="contained" 
            style={{
              width: '80px', 
              top: '30px',  
              textTransform: 'none'
            }}
            onClick={handleKeyDown}
          >
            Search
          </Button>
        </div>
        {/* {startDate.toUTCString()}
        <br/>
        {searchResults.length}
        <br/>
        {searchText} */}
      </div>
      {/* MAP STUFF */}
      <div className='map'>
        {/* // Make sure you set the height and width of the map container otherwise the map won't show */}
        <MapContainer center={mapCenter} 
          zoom={2} 
          style={{height: "80vh", width: "60vw", margin: "20px"}}
          worldCopyJump={true}
          minZoom={2}
          maxZoom={10}
        >
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
          {satellite.name !== "" && (
          <Polyline // Line connecting Satellite Start Coordinates to Its End Coordinates
            pathOptions={{color: 'blue'}}
            positions={[
              [satellite.startLat, satellite.startLong], 
              [satellite.endLat, satellite.endLong],
            ]}
          />)}
        </MapContainer>
      </div>
    </div>   
  )
}

export default Map
