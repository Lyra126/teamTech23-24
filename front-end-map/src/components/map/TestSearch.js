// https://salehmubashar.com/blog/create-a-search-bar-in-react-js

import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import dummySatellites from '../DummyData';
import DatePicker from 'react-datepicker';
import { addDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchBar.css';

function Search() {
  const [satellite, setSatellite] = useState({name: "", startTime: "", endTime: "", startLat: "", startLong: "", endLat: "", endLong: ""});
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // date picker code
  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState('');

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
  
  // handles when new date is clicked
  // const handleClick = () => {
  //   performSearch();
  // };

  // performs search through database to idenitify potential satellites of the same date or id
  const performSearch = () => {
    // setError('');
    console.log('perfom');
    if (validInput(searchText.trim())) {
      const date = formatDate();
      console.log('Filter Date: ', date);
      if(searchText === '') {
        const filteredSatellites = dummySatellites.filter((satellite) =>
          satellite.startTime.substring(0, 10).includes(date)
        );
        setSearchResults(filteredSatellites);
        console.log(searchResults);
      } else {
        // Perform the search logic based on searchText
        const filteredSatellites = dummySatellites.filter((satellite) =>
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
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className="SearchBar">
        <TextField
          style={{
            width:'200px'
          }}
          value={searchText}
          onChange={handleSearchChange}
          // onKeyDown={handleKeyDown}
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
            zIndex: '2000',}}>
          <ul>
            {searchResults.map(result => (
              <li key={result.name} onClick={() => handleResultSelect(result)}>
                {result.name} {result.startTime}
              </li>
            ))}
          </ul>
          {console.log('displaying possible satellites')}
        </div>)} 
      {/* <List>
        {searchResults.map((satellite) => (
          <ListItem key={satellite.name} onClick={() => handleResultSelect(satellite)}>
            <ListItemText primary={`Satellite Name: ${satellite.name} Start Time: ${satellite.startTime}`} />
          </ListItem>
        ))}
      </List> */}
      {/* DATE FILTER OPTION */}
      <div className='datepick'>
        <DatePicker 
          selected={startDate} 
          onChange={(date) => setStartDate(date)} 
          // onInputClick={handleClick}
          // showTimeSelect
          // timeFormat="HH:mm"
          // timeIntervals={60}
          // timeCaption="time"
          // maxDate={addDays(new Date(), 7)}
          // minDate={new Date()}
        />        
      </div>   
      <div>
          <Button variant="contained" 
            style={{
              width: '80px', 
              top: '30px',  
              textTransform: 'none'}}
              onClick={handleKeyDown}
          >
            Search
          </Button>
        </div>
      {startDate.toUTCString()}
      <br/>
      {searchResults.length}
      <br/>
      {searchText}
      <br/>
      {satellite.name !== "" && (<div className="info"> 
        {satellite.startLat} + {satellite.startLong}
        <br/>
        {satellite.endLat} + {satellite.endLong}
      </div>)}
    </div>
  );
}

export default Search;