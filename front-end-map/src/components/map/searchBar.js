import React, { useState, useEffect, useRef } from 'react';
import dummySatellites from '../DummyData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searchBarPosition, setSearchBarPosition] = useState({ top: 0, left: 0 });

  const searchBarRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

    // Perform search logic here based on searchTerm
    // For example, you can filter an array of data
    // Replace this logic with your actual data fetching or filtering logic
    
    // fetchData is searching through said data to figure out if input was valid
    const fetchData = async () => {
      const filteredData = dummySatellites.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredData);

    };

    // Call fetchData when searchTerm changes
    useEffect (() => {
      fetchData();
      // Get the position of the search bar
    if (searchBarRef.current) {
      const rect = searchBarRef.current.getBoundingClientRect();
      setSearchBarPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    }, [searchTerm]);

    // date picker code
    const [startDate, setStartDate] = useState(new Date());

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className='SearchBar'> 
        <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        />
        {searchTerm > 0  && (<div className="result-overlay" style={{
          // styling the auto filter of the search bar
            position: 'absolute',
            top: searchBarPosition.top + searchBarRef.current?.offsetHeight + 'px',
            left: searchBarPosition.left + 'px',
            width: '30%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: '1',}}>
          <ul>
            {results.map(result => (
              <li key={result.id}>{result.name}</li>
            ))}
          </ul>
        </div>)}  
      </div>
      {/* DATE FILTER OPTION */}
      <div className='datepick'>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      </div>   
    </div>
    
  );
};

export default SearchBar;

// Simulating data fetching
      // used with database - later
      // const response = await fetch('https://api.example.com/data');
      // const data = await response.json();

      // Simulating filtering based on the search term
      // const filteredResults = data.filter(item =>
      //   item.title.toLowerCase().includes(searchTerm.toLowerCase())
      // );

      // setResults(filteredResults);
