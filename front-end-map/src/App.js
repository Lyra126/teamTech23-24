import logo from './logo.svg';
import './App.css';
// make sure to import the various pages needed
// will need to import: import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/* NOTES:
  - without using routers do this, add <Navbar/> inside of div
  - works as an entry point
  - each component is your function, like a home page
  - routing connects a specific url to specific page/component
*/

function App() {
  return (
    <div className="App">
      {/* the only thing in here should be Routes to the different pages */}
      {/* eample of what to do
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/wisceReact/" element={<Home/>}></Route>
          <Route path="/wisceReact/projects" element={<Projects/>}></Route>
          <Route path="/wisceReact/experience" element={<Experience/>}></Route>
          <Route path="/wisceReact/displayProject/:id" element={<DisplayProject/>}></Route>
        </Routes>
        <Footer/>
      </Router> 
      */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {/* Edit <code>src/App.js</code> and save to reload. */}
          Team Tech front-end MAP in development
        </p>
        
      </header>
    </div>
  );
}

export default App;
