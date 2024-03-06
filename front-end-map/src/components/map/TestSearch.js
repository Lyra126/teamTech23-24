// https://salehmubashar.com/blog/create-a-search-bar-in-react-js

import './TestSearch.css';
import { React, useState } from "react";
import TextField from "@mui/material/TextField";
// import List from '../DummyData';
import { List, ListItem, ListItemText } from '@mui/material';
import Satellites from '../DummyData';

function App() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // const filteredSatellites = Satellites.filter((satellite) =>
  //   satellite.name.toLowerCase().includes(searchText.toLowerCase())
  // );

  const handleSearchChange = (event) => {
    console.log('change');
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    console.log('perfom');
    // Perform the search logic based on searchText
    const filteredSatellites = Satellites.filter((satellite) =>
      satellite.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResults(filteredSatellites);
  };

  return (
    <div className="main">
      <h1>React Search</h1>
      <div className="search">
      <TextField
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          label="Search"
          variant="outlined"
          fullWidth
        />
      </div>
      <List>
        {searchResults.map((satellite) => (
          <ListItem key={satellite.name}>
            <ListItemText primary={`Satellite Name: ${satellite.name}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default App;