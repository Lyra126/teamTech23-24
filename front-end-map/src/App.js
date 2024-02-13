import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Map from './components/map/MapPage';
import Home from './components/pages/Home';
// import Calendar from './components/pages/Calendar';
// make sure to import the various pages needed

/* NOTES:
  - without using routers do this, add <Navbar/> inside of div
  - works as an entry point
  - each component is your function, like a home page
  - routing connects a specific url to specific page/component
*/

function App() {
  return (
    <div>
      {/* the only thing in here should be Routes to the different pages */}
      <Router>
        <Navbar/>
        <Routes>
          {/* adding routes to pages */}
          <Route path="/front-end-map/map" element={<Map/>}></Route>
          <Route path="/front-end-map/" element={<Home/>}></Route>
        </Routes>
      </Router> 
    </div>
  );
}

export default App;