// https://salehmubashar.com/blog/create-a-search-bar-in-react-js

import './TestSearch.css';
import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import List from '../DummyData';

function App() {
    const [inputText, setInput] = useState("");
    const validInput = new RegExp('[0-9]{1,5}');
    let inputHandler = (e) => {
        if (validInput.test(e.target.value)) {
            setInput(e.target.value);
          } else {
            setInput('');
          }
    }
  return (
    <div className="main">
      <h1>React Search</h1>
      <div className="search">
        <TextField
          id="outlined-basic"
          onChange={inputHandler}
          variant="outlined"
          fullWidth
          label="Search"
        />
      </div>
        <List input={inputText}/>
    </div>
  );
}

export default App;