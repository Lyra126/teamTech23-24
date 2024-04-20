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
import austinIcon from "../images/austin_ground.png"
import tokyoIcon from "../images/tokyo_ground.png"
import sarasotaIcon from "../images/sarasota_ground.png"

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
  const [satellite, setSatellite] = useState({name: "", startTime: "", endTime: "", startTimeLat: "", startTimeLong: "", endTimeLat: "", endTimeLong: ""});
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
    setSearchText(event.target.value);
  };
  
  // performs search when user press enter key on keyboard
  // might change to a button to make it more easier for the user to use and understand
  const handleKeyDown = () => {
    performSearch();
  };
  
  // performs search through database to idenitify potential satellites of the same date or id
  const performSearch = () => {
    setError('');
    
    if (validInput(searchText)) {
      const date = formatDate();
      console.log('Filter Date: ', date);
      if(searchText === '') {
        console.log("Filtering By Date:");
        const filteredSatellites = satelliteList.filter((satellite) => {
            if (satellite.startTime.substring(0, 10).includes(date)) {
              console.log(satellite.ID);
            }
            return satellite.startTime.substring(0, 10).includes(date)
        });
        console.log(filteredSatellites.startDate);
        console.log("Filtered", filteredSatellites);
        setSearchResults(filteredSatellites);
        console.log(searchResults);
      } else {
        console.log("Filtering by Name & Date:");
        // Perform the search logic based on searchText
        const filteredSatellites = satelliteList.filter((satellite) => {
          if (satellite.ID.includes(searchText)) {
            console.log(satellite.ID);
          }
          if (satellite.startTime.substring(0, 10).includes(date)) {
            console.log(satellite.startTime);
          }
          return satellite.ID.includes(searchText) && satellite.startTime.substring(0, 10).includes(date)
        });
        console.log(filteredSatellites.startDate);
        console.log("Filtered", filteredSatellites);
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
    console.log("Search Input", searchInput);
    return searchInput === '' || /^.{1,6}$/.test(searchInput);
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
    setSearchText(result.ID); // sets search bar value with the selected satellite's name
    setSearchResults([result]); // sets searchresults = to the satellite selected
    setSatellite(result);
    // set satellite variable to specific instant
    console.log('SearchResults Current: ', searchResults);
    console.log('Set Satellite to: ', satellite);
  };

  // ensures error status is being updated continuously
  useEffect(() => {
    if(validInput(searchText)) {
      // setError('');
      if(searchText !== '' && searchText.length === 5) {
        if (searchResults.length === 0) {
          setError('No Satellites Found For Given ID and Date Combo');
        }
      } 
    } else {
      setError('Invalid Satellite ID Input. Please Try Again.')
    }
    // console.log("Error Message Use Effect Valid Input Error:", error);
  }, [searchText, searchResults]);

  // ensures that performSearch is called whenever searchText or startDate is changed
  useEffect(() => {
    setError('');
    // console.log("Error Message Use Effect:", error);
  }, [searchText, startDate]);

  useEffect(() => {
    if (searchResults === 1) {
      setSatellite(searchResults[0]);
    }
    // console.log("Use Effect Set Sat: ", searchResults);
  }, [searchResults]);

  // Map Functions & Variables
  const [mapCenter, setMapCenter] = React.useState([0.0, 0.0]); // Default center
  
  // icon
  const austinGroundIcon = new Icon({
    iconUrl: austinIcon,
    // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
    iconSize: [25, 25]
  });

  const tokyoGroundIcon = new Icon({
    iconUrl: tokyoIcon,
    // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
    iconSize: [25, 25]
  });

  const sarasotaGroundIcon = new Icon({
    iconUrl: sarasotaIcon,
    // Satellite icon created by Freepik - Flaticon at https://www.flaticon.com/free-icon/satellite_1072372?term=satellite&page=1&position=2&origin=search&related_id=1072372
    iconSize: [25, 25]
  });
  
  useEffect(() => {
    setMapCenter(0.0, satellite.startLong);
  }, [satellite])

  // GETTING DATA FROM DATABASE
  useEffect(() => {
    const getItems = async() => {
      try {
        const response = await fetch("http://localhost:8080/api/satellite");
        const satelliteSched = await response.json();
        // Create an array to store all schedules
        let allSchedules = [];
        satelliteSched.forEach((satellite) => {
          const { schedule } = satellite;

          // Trim excess whitespace from ID for each satellite
          const trimmedSchedule = schedule.map((sat) =>
            sat.ID.length > 5 ? { ...sat, ID: sat.ID.trim() } : sat
          );

          // Concatenate the schedules to allSchedules
          allSchedules = allSchedules.concat(trimmedSchedule);
        });
        // Set satelliteList to the combined schedules
        setSatelliteList(allSchedules);
        // console.log("Current List:", satelliteList);
      } catch(err) {
        console.error("Error fetching data:", err);
      }
    }
    getItems();
  }, [satelliteList]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevents the default Enter behavior (e.g., form submission)
        performSearch();
      }
    };

    // Add event listener when component mounts
    document.addEventListener('keydown', handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [performSearch]); 

  return (
    <div className='overall'>
      <Button 
        variant="contained" 
        style={{
          width: '150px',   
          textTransform: 'none',
          position: 'absolute',
          justifyContent: 'left',
          left: '20px', // Adjust this value to change the distance from the left edge of the page
          top: '20px',
        }}
        href='/' rel='noopener'>
        Back to Calendar
      </Button>
      <h1>CACI Satellite Scheduler</h1>
      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="SearchBar">
          <TextField
            sx={{
              width:'200px',
              '& .MuiInputBase-input': {
                color: 'black', // Text color
              },
              '& .MuiInputBase-root': {
                backgroundColor: 'lightgray', // Background color
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'purple', // Outline color
                },
                '&:hover fieldset': {
                  borderColor: 'purple', // Outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'purple', // Outline color when focused
                },
              },
              '& .MuiFormLabel-root': {
                color: 'purple', // Label text color
              },
              '& .MuiFormLabel-root.Mui-focused': {
                color: 'purple', // Label text color when focused
              },
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
              top: '200px',
              left: '30px',
              width: '30%',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: '2000',
              color: 'black'}}>
            <ul>
              {searchResults.map(result => (
                <li key={result.ID} onClick={() => handleResultSelect(result)}>
                  {result.ID} {result.startTime}
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
            maxDate={addDays(new Date(), 3)}
            minDate={new Date()}
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
          <Marker // Marker for Sarasota
            position={[27.2256, -82.2608]} 
            icon = {tokyoGroundIcon}
          />
          <Marker // Marker for Austin
            position={[30.26666, -97.73830]}
            icon = {austinGroundIcon}
          />
          <Marker // Marker for Tokyo
            position={[35.652832, 139.839478]} // FIXTHIS only showing on half of map rn 
            icon = {tokyoGroundIcon}
          />
          {satellite.ID !== "" && (
          <Polyline // Line connecting Satellite Start Coordinates to Its End Coordinates
            pathOptions={{color: 'blue'}}
            positions={[
              [satellite.startTimeLat, satellite.startTimeLong], 
              [satellite.endTimeLat, satellite.endTimeLong],
            ]}
          />)}
        </MapContainer>
      </div>
    </div>   
  )
}

export default Map
