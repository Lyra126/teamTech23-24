import './App.css';
import Navbar from './components/Navbar';
import Map from './components/map/Map';
// import Calendar from './components/pages/Calendar';
// make sure to import the various pages needed
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <p>hello</p>
      <Router>
        <Navbar/>
        <Routes>
          <Route/>
        </Routes>
      </Router> 
    </div>
  );
}

export default App;