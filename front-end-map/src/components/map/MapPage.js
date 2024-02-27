// Website Team
// work on webpage here
// will intergrate Map.js here to produce the map onto the page

// Please make sure to write comments as you go to help with future reference
import React, { useState } from 'react'
import Map from './Map'
import SearchBar from './searchBar'
// import DateFilter from './DateFilter'


const MapPage = () => {

  // add for satellite data to be passed to map
  const [objectData, setObjectData] = useState(null);

  const handleSearch = (data) => {
    // Update the objectData in the state
    setObjectData(data);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch}/>
      <Map />
    </div>    
  )
}

export default MapPage