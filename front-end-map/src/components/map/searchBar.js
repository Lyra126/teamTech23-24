import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    // Perform search logic here based on searchTerm
    // For example, you can filter an array of data
    // Replace this logic with your actual data fetching or filtering logic
    
    // fetchData is searching through said data to figure out if input was valid
    const fetchData = async () => {
      // Simulating data fetching
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();

      // Simulating filtering based on the search term
      const filteredResults = data.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setResults(filteredResults);
    };

    // Call fetchData when searchTerm changes
    fetchData();
  }, [searchTerm]);

  return (
    <div className='SearchBar'>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
