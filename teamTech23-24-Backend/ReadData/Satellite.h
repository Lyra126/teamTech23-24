//
// Created by Clarissa Mac on 2/28/23.
//

#pragma once
#include <utility>
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
        //duration that the satellite will communicate with the ground station vector of start time end time pairs
        std::vector<std::pair<libsgp4::DateTime, libsgp4::DateTime>> passes;
        libsgp4::Tle tle;
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
        int passNumber;

        std::string name;
        std::string startString;
        std::string endString;

    public:
        //constructor
        Satellite(libsgp4::Tle tle1, libsgp4::DateTime currentTime): tle(tle1), dt(currentTime), eci(dt, 1, 1, 1), obs(29,82,1), sgp4(tle){
            constructorSuccess = true;
            maxElevation = 0;
            passNumber = -1;
            name = tle1.Name();
            try{
                eci = sgp4.FindPosition(dt);
                geo = eci.ToGeodetic();
            } catch(libsgp4::SatelliteException& e){
                std::cout << "Could not calculate ECI" << std::endl;
                constructorSuccess = false;
            }

        }

        //accessors
        string getName() const;
        int getRank() const;
        string getID() const;
        string getStartString() const;
        string getEndString() const;
        libsgp4::DateTime getStartTime() const;
        libsgp4::DateTime getEndTime() const;
        float getStartTimeLatitude() const;
        float getStartTimeLongitude() const;
        float getEndTimeLatitude() const;
        float getEndTimeLongitude() const;
        void printPasses() const;
        libsgp4::Tle getTle() const;
        std::vector<std::pair<libsgp4::DateTime, libsgp4::DateTime>> getPasses() const;
        libsgp4::DateTime getDt() const;
        libsgp4::Eci getEci() const;
        libsgp4::CoordTopocentric getTopo() const;
        libsgp4::CoordGeodetic getGeo() const;
        libsgp4::Observer getObs() const;
        libsgp4::SGP4 getSgp4() const;
        int getMaxElevation() const;
        int getPassNumber() const;
        int getNumPasses() const;
        bool getConstrSuccess() const;
        libsgp4::DateTime getEarliestEndTime() const;
        std::pair<libsgp4::DateTime, libsgp4::DateTime> getPass(int index) const;

        //mutators
        bool setStartAndEndTime();


        bool isLEO();
        void calculatePos(float timePassed);
        float calculateDistance(float gs_lat, float gs_lon, float gs_alt, float x_point, float y_point);
        void assignRank();
        void generatePasses();
        int findShorterDistance(float gs1_lat, float gs1_lon, float gs1_alt, float gs2_lat, float gs2_lon, float gs2_alt, float start_lat, float start_lon, float end_lat, float end_lon);

        // operator overloaders
        bool operator< (const Satellite& rSat) const;
        Satellite& operator= (const Satellite& rSat);
        bool operator== (const Satellite& other) const;

        void toString() const;
};

