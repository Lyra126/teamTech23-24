// Website Team
// work on webpage here
// will intergrate Map.js here to produce the map onto the page

// Please make sure to write comments as you go to help with future reference
import React from 'react'
import Map from './Map'
import SearchBar from './searchBar'
// import DateFilter from './DateFilter'


const MapPage = () => {
  return (
    <div>
      <SearchBar/>
      <Map/>
    </div>    
  )
}

export default MapPage