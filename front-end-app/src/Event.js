import "./index.css";
import React, { useState, useEffect } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



function convertMilitaryStringToTime(militaryTimeString) {
  if (!militaryTimeString || typeof militaryTimeString !== 'string') {
    return null; // or handle the error appropriately
  }
  const [hours, minutes, seconds] = militaryTimeString.split(':');
  const currentDate = new Date();
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(seconds); // Set seconds to 0 for precision

  return currentDate;
}


const ShowEvents = ( startDate, timeZone, location ) => {
  const [satelliteItems, setSatellite] = useState([]);
  const [sarasotaSchedule, setSarasotaSchedule] = useState([]);
  const [austinSchedule, setAustinSchedule] = useState([]);
  const [tokyoSchedule, setTokyoSchedule] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/satellite');
        const satelliteSched = await response.json();
        satelliteSched.forEach(satellite => {
          const { name, schedule } = satellite;
          switch (name) {
            case "Sarasota":
              setSarasotaSchedule(schedule);
              break;
            case "Austin":
              setAustinSchedule(schedule);
              break;
            case "Tokyo":
              setTokyoSchedule(schedule);
              break;
            default:
              break;
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    
  }, [startDate]);

  useEffect(() => {
    console.log("Sarasota Schedule:", sarasotaSchedule);
  }, [sarasotaSchedule]);

  useEffect(() => {
    console.log("Austin Schedule:", austinSchedule);
  }, [austinSchedule]);

  useEffect(() => {
    console.log("Tokyo Schedule:", tokyoSchedule);
  }, [tokyoSchedule]);

  let selectedSchedule;
  if (location === "Sarasota, Florida") {
    selectedSchedule = sarasotaSchedule;
  } else if (location === "Austin, Texas") {
    selectedSchedule = austinSchedule;
  } else if (location === "Tokyo, Japan") {
    selectedSchedule = tokyoSchedule;
  }

  return (
    <div className="Events" style={{backgroundColor: '#F5F5F5'}}>
      <div className="head" style={{width: 'auto', margin: 'auto', backgroundColor: '#F5F5F5'}}>
        <h1 style={{color: '#6a1fa4'}}>  Satellite Schedule for Ground Station at: </h1>
        <h2 style={{ color: '#6a1fa4' }}> {location} </h2>
        <h3>Number of Satellites: {selectedSchedule.length} satellites</h3>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, backgroundColor: '#FFFFFF', border: '5px solid purple' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '130%' }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '130%' }}>
                  ID
                </TableCell>
                <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '130%'}}>
                  Start Time ({timeZone})
                </TableCell>
                <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '130%'}}>
                  End Time ({timeZone})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedSchedule.map((item, index) => {
     
                const [startHoursStr, startMinutesStr, startSecondsStr] = item.startTime.split(":");
                const startHours = parseInt(startHoursStr, 10);

                let adjustedStartHours;
                if (timeZone === "UTC-05") {
                  adjustedStartHours = startHours - 5;
                } else if (timeZone === "UTC-08") {
                  adjustedStartHours = startHours - 8;
                } else {
                  adjustedStartHours = startHours;
                }

                adjustedStartHours = (adjustedStartHours + 24) % 24;

                const adjustedStartHoursStr = adjustedStartHours < 10 ? "0" + adjustedStartHours : adjustedStartHours.toString();
                const adjustedStartTime = `${adjustedStartHoursStr}:${startMinutesStr}:${startSecondsStr}`;

                const [endHoursStr, endMinutesStr, endSecondsStr] = item.endTime.split(":");
                const endHours = parseInt(endHoursStr, 10);

                let adjustedEndHours;
                if (timeZone === "UTC-05") {
                  adjustedEndHours = endHours - 5;
                } else if (timeZone === "UTC-08") {
                  adjustedEndHours = endHours - 8;
                } else {
                  adjustedEndHours = endHours;
                }

                adjustedEndHours = (adjustedEndHours + 24) % 24;

                const adjustedEndHoursStr = adjustedEndHours < 10 ? "0" + adjustedEndHours : adjustedEndHours.toString();
                const adjustedEndTime = `${adjustedEndHoursStr}:${endMinutesStr}:${endSecondsStr}`;

                return (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center" sx={{ fontSize: '90%' }}>{item.name}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '90%' }}>{item.ID}</TableCell>
                   
                    <TableCell align="center" component="th" scope="satelliteItems" sx={{fontSize: '90%'}}>
                      {adjustedStartTime}
                    </TableCell>
                    <TableCell align="center" sx={{fontSize: '90%'}}>
                      {adjustedEndTime}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
          
  );
}

export default ShowEvents;
