//
// Created by Clarissa Mac on 2/28/23.
//

#pragma once

#include <vector>
#include "libsgp4/Tle.h"
#include "libsgp4/DateTime.h"
#include "libsgp4/Eci.h"
#include "libsgp4/SGP4.h"
#include "libsgp4/CoordTopocentric.h"
#include "libsgp4/CoordGeodetic.h"
#include "libsgp4/Observer.h"

using namespace std;

class Satellite {
private:
    libsgp4::Tle tle;

    //duration that the satellite will communicate with the ground station
    // vector of start time end time pairs
    std::vector<std::pair<libsgp4::DateTime, libsgp4::DateTime>> passes;

    libsgp4::DateTime startTime;
    libsgp4::DateTime endTime;
    libsgp4::DateTime dt;
    libsgp4::Eci eci;
    libsgp4::CoordTopocentric topo;
    libsgp4::CoordGeodetic geo;
    libsgp4::Observer obs;
    libsgp4::SGP4 sgp4;
    double maxElevation;
    int rank;
    bool constructorSuccess;

    // For the database
    std::string name;
    std::string startString;
    std::string endString;

public:
    //constructor
    Satellite(libsgp4::Tle tle1, libsgp4::DateTime currentTime): tle(tle1), dt(currentTime), eci(dt, 1, 1, 1), obs(29,82,1), sgp4(tle){
        constructorSuccess = true;
        maxElevation = 0;
        try{
            eci = sgp4.FindPosition(dt);
            geo = eci.ToGeodetic();
        } catch(libsgp4::SatelliteException& e){
            std::cout << "Could not calculate ECI" << std::endl;
            constructorSuccess = false;
        }

    }

    bool isLEO();

    void calculatePos(float timePassed);

    float calculateDistance();

    void assignRank();

    void generatePasses();

    int getNumPasses();

    bool getConstrSuccess();

    string getName();

    string getStartString();

    string getEndString();

    libsgp4::DateTime getStartTime();

    libsgp4::DateTime getEndTime();

    libsgp4::DateTime setStartTime(libsgp4::DateTime st);

    libsgp4::DateTime setEndTime(libsgp4::DateTime et);

    void toString();

    int getRank();

    libsgp4::DateTime getEarliestEndTime() const;

    // Overload < for Min Heap
    bool operator< (const Satellite& rSat) const;
};

