import React from 'react'
import './Home.css'
import SearchBar from '../map/searchBar'

const Home = () => {
  return (
    <div className='home'>
      <SearchBar/>
      <div className='about'>
        <h2>Hello, this is Team Tech!</h2>
        <div className='prompt'>
          <p>CACI satellite scheduler testing testing</p>
        </div>
      </div>
    </div>
  )
}

export default Home