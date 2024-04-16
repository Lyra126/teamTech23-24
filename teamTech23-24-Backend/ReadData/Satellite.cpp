#include <iostream>
#include <vector>
#include <fstream>
#include "libsgp4/SGP4.h"
#include "Satellite.h"
#include "libsgp4/Tle.h"
#include "libsgp4/DateTime.h"
#include "libsgp4/Observer.h"
#include "libsgp4/Eci.h"
#include "libsgp4/CoordTopocentric.h"
#include <vector>
#include <string>
#include <math.h>
#include <cmath>
#include <map>
#include <stdexcept>

using namespace std;

// Define a struct for a coordinate
struct Coordinate {
    double x;
    double y;
};

//accessors
string Satellite::getName() const{
    {return name;}
}

int Satellite::getRank() const{
    return rank;
}

string Satellite::getStartString() const{
    return startString;
}

string Satellite::getEndString() const{
    return endString;
}


libsgp4::DateTime Satellite::getStartTime() const{
    return startTime;
}

libsgp4::DateTime Satellite::getEndTime() const{
    return endTime;
}

libsgp4::DateTime Satellite::getEarliestEndTime() const{
    return passes.at(0).second;
}

float Satellite::getStartTimeLatitude() const{
    return  libsgp4::Util::RadiansToDegrees(sgp4.FindPosition(startTime).ToGeodetic().latitude);
}

float Satellite::getStartTimeLongitude() const{
    return libsgp4::Util::RadiansToDegrees(sgp4.FindPosition(startTime).ToGeodetic().longitude);
}

float Satellite::getEndTimeLatitude() const{
    return libsgp4::Util::RadiansToDegrees(sgp4.FindPosition(endTime).ToGeodetic().latitude);
}

float Satellite::getEndTimeLongitude() const{
    return libsgp4::Util::RadiansToDegrees(sgp4.FindPosition(endTime).ToGeodetic().longitude);
}

libsgp4::Tle Satellite::getTle() const{
    return tle;
}

std::vector<std::pair<libsgp4::DateTime, libsgp4::DateTime>> Satellite::getPasses() const{
    return passes;
}

libsgp4::DateTime Satellite::getDt() const{
    return dt;
}

libsgp4::Eci Satellite::getEci() const{
    return eci;
}
libsgp4::CoordTopocentric Satellite::getTopo() const{
    return topo;
}

libsgp4::CoordGeodetic Satellite::getGeo() const{
    return geo;
}

libsgp4::Observer Satellite::getObs() const{
    return obs;
}

libsgp4::SGP4 Satellite::getSgp4() const{
    return sgp4;
}

int Satellite::getMaxElevation() const{
    return maxElevation;
}

int Satellite::getPassNumber() const{
    return passNumber;
}

int Satellite::getNumPasses() const {
    return passes.size();
}

bool Satellite::getConstrSuccess() const{
    return constructorSuccess;
}


//mutators
bool Satellite::setStartAndEndTime(){
    passNumber++;

    if(passNumber < passes.size()){
        startTime = passes.at(passNumber).first;
        endTime = passes.at(passNumber).second;
        toString();
        return true;
    }
    return false;
}


bool Satellite::isLEO(){
    if((tle.Inclination(true) > 0 && tle.Inclination(true) < 90) || (tle.MeanMotion() > 14 && tle.MeanMotion() < 17)) {
        return true;
    }
    return false;
}

//function to calculate - Where and when the antenna should point over a 7-day period (coordinates,
// angles as it changes over a 7-day period, take into account velocity of satellite moving)
void Satellite::calculatePos(float timePassed){
    dt = tle.Epoch().AddMinutes(timePassed);
    //calculate satellite position
    eci = sgp4.FindPosition(dt);
    //get look angle for observer to satellite
    topo = obs.GetLookAngle(eci);
    //convert satellite position to geodetic coordinates
    geo = eci.ToGeodetic();
}

float Satellite::calculateDistance(float gs_lat, float gs_lon, float gs_alt, float x_point, float y_point) {
    double baseLat = gs_lat;
    double baseLon = gs_lon;
    double baseAlt = gs_alt;
    double earthRadius = 6371.0; // Earth's radius in kilometers
    double dLat = this->geo.latitude - baseLat;
    double dLon = this->geo.longitude - baseLon;
    double a = sin(dLat/2) * sin(dLat/2) + cos(baseLat) * cos(this->geo.latitude) * sin(dLon/2) * sin(dLon/2);
    double c = 2 * atan2(sqrt(a), sqrt(1-a));
    double d = earthRadius * c;
    double dh = this->geo.altitude - baseAlt;
    return sqrt(d * d + dh * dh);
}

void Satellite::assignRank() {
    auto mean_motion = tle.MeanMotion();

    if (!isLEO()) {
        rank = 0; // satellite is tossed out when 0
    } else if (mean_motion >= 17 || maxElevation >= 1.047) {
        rank = 1;
    } else if ((15 <= mean_motion && mean_motion <= 16) || (0.524 <= maxElevation)) {
        rank = 2;
    } else if((0.175 <= maxElevation)) {
        rank = 3;
    } else { // Angle of elevation is too low
        rank = 0;
    }
}


void Satellite::generatePasses(){
    try {
        // Get current time
        libsgp4::DateTime now(dt);

// Loop over the next 24 hours
        const int numSteps = 24 * 60 * 60 * 3;
        std::vector<libsgp4::DateTime> times(numSteps);
        std::vector<libsgp4::CoordTopocentric> positions(numSteps);
        for (unsigned long i = 0; i < numSteps; ++i) {
            // Calculate time
            times[i] = now.AddSeconds((double) i);
            // Calculate satellite position
            libsgp4::Eci eciNext = sgp4.FindPosition(times[i]);
            libsgp4::CoordTopocentric topoC = obs.GetLookAngle(eciNext);
            // Save position
            positions[i] = topoC;
        }

        // libsgp4::DateTime visibility periods
        libsgp4::DateTime visibleStart, visibleEnd;
        bool visible = false;
        for (unsigned int i = 0; i <
                                 numSteps; ++i) { // || visibleEnd.Minute() - visibleStart.Minute() < 16 || visibleEnd.Minute() - visibleStart.Minute() < -43
            if (positions[i].elevation > 0) {
                if (maxElevation < positions[i].elevation) {
                    maxElevation = positions[i].elevation;
                }
                if (!visible) {
                    visibleStart = times[i];
                    visible = true;
                }
                visibleEnd = times[i];
            } else {
                if (visible) {
                    std::pair access(visibleStart, visibleEnd);
                    if (visibleEnd.Minute() - visibleStart.Minute() > 1) {
                        passes.push_back(access);
                    }
                    std::cout << "Satellite visible from " << visibleStart << " to " << visibleEnd << "\n";
                    visible = false;
                }
            }
        }

        if (visible) {
            std::pair access(visibleStart, visibleEnd);
            if (visibleEnd.Minute() - visibleStart.Minute() > 1) {
                passes.push_back(access);
            }
            //std::cout << "Satellite visible from " << visibleStart << " to " << visibleEnd << "\n";
        }

        if (passes.size() > 0) {
            startTime = passes.at(0).first;
            endTime = passes.at(0).second;
            passNumber = 0;
        }
    } catch (const libsgp4::DecayedException& e) {
        std::cerr << "Decayed satellite: " << e.what() << std::endl;
        // Skip processing the current satellite and continue with the next one
        return;
    }catch (const libsgp4::SatelliteException& e) {
        std::cerr << "Satellite exception: " << e.what() << std::endl;
        return;
    }
}


int Satellite::findShorterDistance(float gs1_lat, float gs1_lon, float gs1_alt, float gs2_lat, float gs2_lon, float gs2_alt, float start_lat, float start_lon, float end_lat, float end_lon) {
    // Variables to count occurrences for each ground station
    int gs1_count = 0, gs2_count = 0;

    // We are choosing 15 points on the line to compare for now, we can change this later
    int numPoints = 15;

    // Calculate change in latitude and longitude between consecutive evenly spaced out points on the line
    double dx = (end_lon - start_lon) / (numPoints - 1);
    double dy = (end_lat - start_lat) / (numPoints - 1);

    // Distance between satellite and ground stations (temp variable)
    int gs1_distance, gs2_distance;

    // Loop through each point on the line
    for (int i = 0; i < numPoints; ++i) {
        // Define a coordinate for the current point
        Coordinate point;

        // Calculate the coordinates of the current point
        point.x = start_lon + i * dx;
        point.y = start_lat + i * dy;

        // Calculate distance between ground stations and the current point
        gs1_distance = calculateDistance(gs1_lat, gs1_lon, gs1_alt, point.x, point.y);
        gs2_distance = calculateDistance(gs2_lat, gs2_lon, gs2_alt, point.x, point.y);

        // Compare distances and increment counts accordingly
        if (gs1_distance < gs2_distance)
            gs1_count++;
        else if (gs2_distance < gs1_distance)
            gs2_count++;
        else {
            gs1_count++;
            gs2_count++;
        }
    } // End of loop

    // Return 1 if more points are closer to ground station 1, otherwise return 2 to show that ground station 2 is closer
    return (gs1_count > gs2_count) ? 1 : 2;
} // End of function



bool Satellite::operator< (const Satellite& rSat) const{
    if(getEarliestEndTime().Compare(rSat.getEarliestEndTime()) == 1) //endTime > rSat.getEndTime()
        return true;
    else
        return false;
}

Satellite& Satellite::operator= (const Satellite& rSat){
    if(this != &rSat){
        this->tle = rSat.getTle();
        this->passes = rSat.getPasses();
        this->startTime = rSat.getStartTime();
        this->endTime = rSat.getEndTime();
        this->dt = rSat.getDt();
        this->eci = rSat.getEci();
        this->topo = rSat.getTopo();
        this->geo = rSat.getGeo();
        this->obs = rSat.getObs();
        this->sgp4 = rSat.getSgp4();
        this->maxElevation = rSat.getMaxElevation();
        this->rank = rSat.getRank();
        this->passNumber = rSat.getPassNumber();
        this->name = rSat.getName();
        this->startString = rSat.getStartString();
        this->endString = rSat.getEndString();
    }
    return *this;
}

bool Satellite::operator==(const Satellite& other) const {
    return (
            this->passes == other.getPasses() &&
            this->startTime == other.getStartTime() &&
            this->endTime == other.getEndTime() &&
            this->dt == other.getDt() &&
            this->maxElevation == other.getMaxElevation() &&
            this->rank == other.getRank() &&
            this->passNumber == other.getPassNumber() &&
            this->name == other.getName() &&
            this->startString == other.getStartString() &&
            this->endString == other.getEndString());
}


void Satellite::toString(){
    name = tle.Name();
    startString = startTime.ToString();
    endString = endTime.ToString();
}

