import "./index.css";
import React, { useState, useEffect } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { timeZone, location } from './components/Navbar';



function convertMilitaryStringToTime(militaryTimeString) {
  const [hours, minutes, seconds] = militaryTimeString.split(':');
  const currentDate = new Date();
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(seconds); // Set seconds to 0 for precision

  return currentDate;
}


const ShowEvents = ( startDate, time, location ) => {
  // create loop that searches for specific date
  // day = format(day, "MM/dd/YYYY");
  // call search function to search for specific date

  const [satelliteItems, setSatellite] = useState([]);
  console.log("param" ,startDate)

  useEffect(() => {
    async function getItems() {

      const response = await fetch('http://localhost:8080/api/satellite');
      const newSatellite = await response.json();

      newSatellite.sort((a,b) => {
        
        const milTimeA = convertMilitaryStringToTime(a.startTime.substring(11,19))
        const milTimeB = convertMilitaryStringToTime(b.startTime.substring(11,19))
        console.log("AsatID", a.name, "A Full", a.startTime, "milTimeA", milTimeA)
        console.log("BsatID", b.name, "B Full", b.startTime, "milTimeB", milTimeB)
        
        return milTimeA - milTimeB;
      });
     
      console.log( "response sat" ,newSatellite)
      const newSatelliteItems = [];

      // Iterate through the data and create a 2D array of satellite items
      newSatellite.forEach(item => {
        // console.log(item)

        const satelliteItem = [item.name, item.startTime.substring(11,19), item.endTime.substring(11,19)];
        const start = item.startTime.substring(0,10)
        const end = item.endTime.substring(0,10)
        // const start = satelliteItem[1].substring(0,10)
        // const end = satelliteItem[2].substring(0,10)

        // const indexToUpdate = 8;
        const dayUpdate = (parseInt(start.substring(8,10))+1).toString().padStart(2,'0');
        const nextDay = start.substring(0,8) + dayUpdate
        

        
        console.log(start);
        console.log(startDate);
        console.log(end);
        console.log(nextDay);
        
        if(start === startDate || end === nextDay) {
          newSatelliteItems.push(satelliteItem);
          // console.log("today", start)
          // console.log("param" ,startDate)  
          // console.log("nextDay Day", dayUpdate)
          // console.log("Tommorrow", nextDay)
          // console.log("endDate", end);
        }
        
      
      });
      console.log(newSatelliteItems);
      setSatellite(newSatelliteItems);
    }

    getItems();
  }, [startDate]);  

  return (
    <div className="Events"
      style={{
        backgroundColor: '#F5F5F5',
      }}>

      {/* <h4> {format(new Date(startDate), "ccc dd MMM yy")} </h4> */}
      <div 
        className="head"
        style={{
          width: 'auto',
          margin: 'auto',
          backgroundColor: '#F5F5F5',
        }}>
        <h1
          style={{
            color: '#6a1fa4',
            
          }}>
            Satellite Schedule for Ground Station at:
        </h1>
        <h2
          style={{
            color: '#6a1fa4',
          }}>
            {location}
        </h2>
        <h3>Number of Satellites: {satelliteItems.length} satellites</h3>
        <h5 style ={{color: '#FF0000'}}> This schedule expires in 1 to 3 days! </h5>
        
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, backgroundColor: '#FFFFFF',border: '5px solid purple'} } aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '130%'}}>SSC</TableCell>
            <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '130%'}}>
                Start Time ({timeZone})
            </TableCell>
            <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '130%'}}>
              End Time ({timeZone})
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {satelliteItems.map((item, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" component="th" scope="satelliteItems" sx={{fontSize: '90%'}}>
                {item[0]}
              </TableCell>
              <TableCell align="center" sx={{fontSize: '90%'}}>
                {item[1]}
              </TableCell>
              <TableCell align="center" sx={{fontSize: '90%'}}>
                {item[2]}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>







          {/* <table>
            <th>Name</th>
            <th>Start Time</th>
            <th>End Time</th>

          {satelliteItems.map((item, index) => (
            <tr key={index}>
              <td> {item[0]} </td>
              <td> {item[1].substring(11,19)} UTC </td>
              <td> {item[2].substring(11,19)} UTC </td>
            </tr>
          ))}

          </table> */}

      </div>
    </div>
          
  );
}

export default ShowEvents;
