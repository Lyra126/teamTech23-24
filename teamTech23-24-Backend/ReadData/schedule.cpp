#include <iostream>
#include <vector>
#include <fstream>
#include "Satellite.h"
#include "libsgp4/Tle.h"
#include "groundStation.h"
#include "libsgp4/DateTime.h"
#include "libsgp4/TimeSpan.h"
#include <queue>
#include <map>
#include <set>
#include <algorithm>
#include <cstdlib>
#include <ctime>

const int numGenerations = 5;
map<string, std::vector<Satellite>> createSchedule(vector<vector<Satellite>>& ranks);
void writeToFile(map<string, std::vector<Satellite>> schedule);

int main() {
    libsgp4::DateTime currentTime = libsgp4::DateTime::Now();

    // Initialize variables for reading input file
    std::string buffer;
    std::fstream input("/Users/cc/Downloads/teamTech23-24/teamTech23-24-Backend/ReadData/celestrakList.txt"); // The file of satellites is found in the debug folder
    string line1, line2;

    //Initialize variables for scheduler
    vector<vector<Satellite>> ranks;
    vector<Satellite> rank1;
    vector<Satellite> rank2;
    vector<Satellite> rank3;
    ranks.push_back(rank1);
    ranks.push_back(rank2);
    ranks.push_back(rank3);

    // Read in data from active.txt file until you reach the end of the file
    while(getline(input, buffer)){
        getline(input, line1);
        getline(input, line2);
        //line1.pop_back(); // Gets rid of carriage return character
        //line2.pop_back(); // Gets rid of carriage return character
        //create a TLE object with line 1 and line 2 as arguments
        libsgp4::Tle tle(line1, line2);
        //create a satellite object with the tle as an argument
        Satellite satellite(tle, currentTime);

        if(!satellite.getConstrSuccess())
            continue;

        if(satellite.isLEO()){
            satellite.generatePasses();
            // Satellite does not pass over
            if(satellite.getNumPasses() == 0)
                continue;
            satellite.toString();
            satellite.assignRank();

            if(satellite.getRank() == 1)
                ranks[0].push_back(satellite);
            else if(satellite.getRank() == 2)
                ranks[1].push_back(satellite);
            else if(satellite.getRank() == 3)
                ranks[2].push_back(satellite);
        }
    }

    cout << "-- Satellites all ranked --" << endl;

    writeToFile(createSchedule(ranks));
    return 0;
}


groundStation getGS(const string& id){
    if(id == "Sarasota"){
        return *new groundStation("Sarasota", 27.2256, -82.2608, 7);
    } else if(id == "Austin"){
        return *new groundStation("Austin",  30.26666, -97.73830, 130);
    } else if(id == "Tokyo"){
        return *new groundStation("Tokyo",  35.652832, 139.839478, 40);
    }
    //default
    return *new groundStation("Sarasota", 27.2256, -82.2608, 7);
}

std::map<std::string, std::vector<Satellite>> createRandomSchedule(std::map<std::string, std::vector<Satellite>> scheduleMap, std::vector<vector<Satellite>>& ranks) {
    cout << "-- Starting to generate random schedule --" << endl;
    std::set<int> accessedIndices;
    srand(time(nullptr));
    size_t upperLimit = 0;

    // Iterate over each tier
    for (auto & rank : ranks) {
        // Get a copy of the current rank
        std::vector<Satellite*> temp;
        for (auto& item : rank) {
            temp.push_back(&item);
        }

        while(accessedIndices.size() < temp.size()){
            upperLimit = temp.size();
            size_t randNum = rand() % upperLimit;

            // Find and remove the satellite from the vector if successfully scheduled or it’s
            // already been looked at and we determine that it can’t be fit in any of the ground
            // station schedule
            if(temp[randNum] != nullptr){
                Satellite currentSat(*temp[randNum]);
                //this is to save the first possible location of satellite in the ground station
                //schedules, this also shows which ground stations the satellite can be scheduled at
                std::vector<int> stationIndexes;

                // Loop over ground stations
                for (const auto& station : scheduleMap) {
                    //save copy of each ground station’s schedule for ease of use
                    std::vector<Satellite> stationSchedule = station.second;

                    // Initialize index to -1, indicating no available position found yet
                    int index = -1;

                    // Compare first available position in the station's schedule
                    if (stationSchedule.empty() || currentSat.getEndTime() < stationSchedule[0].getStartTime()) {
                        index = 0;
                    } else {
                        for (size_t i = 1; i < stationSchedule.size(); ++i) {
                            if (currentSat.getStartTime() >stationSchedule[i - 1].getEndTime() &&
                                currentSat.getEndTime() < stationSchedule[i].getStartTime()) {
                                index = i;
                                break;
                            }
                        }
                    }

                    // Store the found index in stationIndexes
                    stationIndexes.push_back(index);
                }
                int bestGS = 0;
                for (const auto& station : scheduleMap) {
                    auto currBestStation = scheduleMap.begin();
                    auto currStation = scheduleMap.begin();
                    for(size_t i = 0; i < stationIndexes.size(); i++) {
                        int bestIndex = stationIndexes[0];
                        bestGS = 0;
                        //if it can be scheduled at that ground station
                        if (stationIndexes[i] != -1)
                            std::advance(currStation, i);
                        std::advance(currBestStation, bestGS);
                        //calculate and compare the distances to see which schedule it should get scheduled to
                        int num = currentSat.findShorterDistance(getGS(currStation->first).getLat(),
                                                                 getGS(currStation->first).getLon(),
                                                                 getGS(currStation->first).getAlt(),
                                                                 getGS(currBestStation->first).getLat(),
                                                                 getGS(currBestStation->first).getLon(),
                                                                 getGS(currBestStation->first).getAlt(),
                                                                 currentSat.getStartTimeLatitude(),
                                                                 currentSat.getStartTimeLongitude(),
                                                                 currentSat.getEndTimeLatitude(),
                                                                 currentSat.getEndTimeLongitude());
                        //current station is closer to the satellite than the current record best station
                        if (num == 1) {
                            bestGS = i;
                            bestIndex = stationIndexes[i];
                        }
                    }
                    //once best ground station is identified for the
                    if (bestGS >= 0 && stationIndexes[bestGS] >= 0 && bestGS < scheduleMap.size()) {
                        // Retrieve the schedule vector for the ground station
                        auto station = scheduleMap.begin();
                        std::advance(station, bestGS);
                        auto& groundStationSchedule = const_cast<std::vector<Satellite>&>(station->second);
                        // Insert the satellite into the schedule at the identified index
                        groundStationSchedule.insert(groundStationSchedule.begin() + stationIndexes[bestGS], currentSat);
                    }
                    temp[randNum] = nullptr;
                    accessedIndices.insert(randNum);
                }
            }
        }
        //remove all elements to look at next ranked tier
        accessedIndices.clear();
    }
    cout << "-- Random Schedule is created --" << endl;
    return scheduleMap;
}

libsgp4::TimeSpan findDuration(Satellite &sat){
    libsgp4::DateTime start = sat.getStartTime();
    libsgp4::DateTime end = sat.getEndTime();
    libsgp4::TimeSpan duration = libsgp4::TimeSpan(0,0,0,0,0);

    //separately converting start and end times to seconds, so we don't need to account for edge cases
    int start_total_seconds = start.Day() * 86400 + start.Hour() * 3600; + start.Minute() * 60; + start.Second();
    int end_total_seconds = end.Day() * 86400 + end.Hour() * 3600 + end.Minute() * 60 + end.Second();

    int secondDifference = end_total_seconds - start_total_seconds;
    int day = secondDifference / 86400;
    secondDifference = secondDifference % 86400;
    int hour = secondDifference / 3600;
    secondDifference = secondDifference % 3600;
    int minute = secondDifference / 60;
    secondDifference = secondDifference % 60;
    int second = secondDifference / 60;

    duration = libsgp4::TimeSpan(day, hour, minute, second);
    return duration;
}

int calculateFitness(const map<string, std::vector<Satellite>>& sched1, const map<string, std::vector<Satellite>> sched2) {

    libsgp4::TimeSpan duration_map_1 = libsgp4::TimeSpan(0,0,0,0,0);
    libsgp4::TimeSpan duration_map_2 = libsgp4::TimeSpan(0,0,0,0,0);
    int sched1Score = 0, sched2Score = 0;
    float totalSched1Ranks = 0, totalSched2Ranks = 0, sched1AvgRank = 0, sched2AvgRank = 0;
    int sched1count = 0, sched2count = 0;

    // map 1
    for (auto & it : sched1) {
        vector<Satellite> currentGSSchedule = it.second;
        for(auto & j : currentGSSchedule) {
            duration_map_1.Add(findDuration(j)); // implement add in datetime.h
            totalSched1Ranks += j.getRank();
            sched1count += 1;
        }
    }

    // map 2
    for (auto & it : sched2) {
        vector<Satellite> currentGSSchedule = it.second;
        for(auto & j : currentGSSchedule) {
            duration_map_2.Add(findDuration(j)); // implement add in datetime.h
            totalSched2Ranks += static_cast<float>(j.getRank());
            sched2count += 1;
        }
    }

    sched1AvgRank = totalSched1Ranks / sched1count;
    sched2AvgRank = totalSched2Ranks / sched2count;

    if (sched1AvgRank > sched2AvgRank)
        sched2Score += 10;
    else if (sched1AvgRank < sched2AvgRank)
        sched1Score += 10;

    if (duration_map_1.Compare(duration_map_2) == -1)
        sched2Score += 15;
    else if (duration_map_1.Compare(duration_map_2) == 1)
        sched1Score += 15;

    cout << "-- Fitness is calculated --" << endl;
    if (sched1Score > sched2Score)
        return 1;
    else if (sched1Score < sched2Score)
        return 2;
    else
        return 1;
}

bool areSchedulesEqual(const map<string, vector<Satellite>>& map1, const map<string, vector<Satellite>>& map2) {
    if (map1.size() != map2.size())
        return false;

    for (auto it1 = map1.begin(), it2 = map2.begin(); it1 != map1.end(); ++it1, ++it2) {
        // Check if keys are equal
        if (it1->first != it2->first)
            return false;
        // Check if values (vectors) are equal
        if (it1->second != it2->second)
            return false;
    }
    // If all keys and values are equal, the maps are the same
    return true;
}


map<string, vector<Satellite>> combineSchedules(int preferred, const map<string, vector<Satellite>>& scheduleMap1, const map<string, vector<Satellite>>& scheduleMap2) {
    cout << "-- Combining schedules --" << endl;
    //in the rare case that they are equal, return scheduleMap1
    if (areSchedulesEqual(scheduleMap1, scheduleMap2)) {
        cout << "Schedules are equal, returning schedule 1" << endl;
        return scheduleMap1;
    }
    // Choose the more optimal schedule
    const map<string, vector<Satellite>>& optimalScheduleMap = (preferred == 1) ? scheduleMap1 : scheduleMap2;
    const map<string, vector<Satellite>>& lessOptimalScheduleMap = (preferred == 1) ? scheduleMap2 : scheduleMap1;

// Create a copy of the optimal schedule map
    map<string, vector<Satellite>> combinedScheduleMap = optimalScheduleMap;

// Iterate through the optimal schedule to look for gaps and lower priority satellites
    for (auto& it1 : optimalScheduleMap) {
        const string& stationName = it1.first;
        vector<Satellite>& optimalSchedule = combinedScheduleMap[stationName];

        auto it2 = lessOptimalScheduleMap.find(stationName);
        if (it2 == lessOptimalScheduleMap.end()) {
            // Station not found in the less optimal schedule map
            continue;
        }

        for(size_t i = 0; i < it1.second.size(); i++) {
            if (i == 0) {
                // Skip the first iteration where i is 0 to prevent out-of-bounds access
                continue;
            }

            // Check if the rank of the satellite from the less optimal schedule is higher
            if (it2->second[i].getRank() < it1.second[i].getRank()) {
                // Replace the lower rank satellite in the optimal schedule with the one from the less optimal schedule
                optimalSchedule[i] = it2->second[i];
                break; // Break the loop after finding a suitable replacement
            }

            // Calculate the gap between current and previous satellite passes
            libsgp4::TimeSpan gap = it1.second[i].getStartTime() - optimalSchedule[i - 1].getEndTime();

            // Check if the gap is within the desired range (8-20 minutes)
            if (gap.Minutes() >= 8 && gap.Minutes() <= 20) {
                // Look at the less optimal schedule for a satellite pass to fill the gap
                for (const Satellite &satellite: it2->second) {
                    // Check if the satellite pass in the less optimal schedule fits in the gap
                    if (satellite.getStartTime() >= optimalSchedule[i - 1].getEndTime() &&
                        satellite.getEndTime() <= optimalSchedule[i].getStartTime()) {
                        //if so, put it in the new schedule
                        optimalSchedule[i] = satellite;
                    }
                }
            }
        }
    }

    cout << "-- Schedules are combined --" << endl;
    return combinedScheduleMap;
}

map<string, std::vector<Satellite>> createSchedule(vector<vector<Satellite>>& ranks) {
    cout << "-- starting to create schedule... --" << endl;
    map<string, std::vector<Satellite>> emptyMap, tempSchedule;
    std::vector<Satellite> emptyVector;
    std::vector<Satellite>* vectorPtr = &emptyVector;
    emptyMap["Sarasota"] = *vectorPtr;
    emptyMap["Austin"] = *vectorPtr;
    emptyMap["Tokyo"] = *vectorPtr;

    int preferred = 0;

    map<string, std::vector<Satellite>> optimalSchedule = createRandomSchedule(emptyMap, ranks);

    for(int i = 0; i < numGenerations; i++){
        cout << "On generation " << i << endl;
        tempSchedule = createRandomSchedule(emptyMap, ranks);
        preferred = calculateFitness(tempSchedule, optimalSchedule);
        cout << "Preferred: " << preferred << endl;
        optimalSchedule = combineSchedules(preferred, optimalSchedule, tempSchedule);
    }
    cout << "-- Schedule created --" << endl;
    return optimalSchedule;
}

void writeToFile(map<string, std::vector<Satellite>> schedule){
    cout << "-- Starting to write schedule to json file  --" << endl;
    std::ofstream file("satelliteSchedule.json");

    // Check if the file is open
    if (!file.is_open()) {
        std::cerr << "Error: Unable to open file: satelliteSchedule.json" << std::endl;
        return;
    }

    // Iterate through each ground station in the schedule map
    for (const auto& entry : schedule) {
        const std::string& groundStationName = entry.first;
        const std::vector<Satellite>& satelliteSchedule = entry.second;

        // Write the ground station name to the file
        file << R"({ "name": ")" << groundStationName << R"(", "schedule": [)" << std::endl;

        // Iterate through each satellite in the ground station's schedule
        for (size_t i = 0; i < satelliteSchedule.size(); ++i) {
            const Satellite& satellite = satelliteSchedule[i];

            // Write satellite information to the file
            file << R"(  { "name": ")" << satellite.getName() << "\", "
                 << R"("startTime": ")" << satellite.getStartString() << "\", "
                 << R"("endTime": ")" << satellite.getEndString() << "\", "
                 << R"("startTimeLat": ")" << satellite.getStartTimeLatitude() << "\", "
                 << R"("startTimeLong": ")" << satellite.getStartTimeLongitude() << "\", "
                 << R"("endTimeLat": ")" << satellite.getEndTimeLatitude() << "\", "
                 << R"("endTimeLong": ")" << satellite.getEndTimeLongitude() << "\" }";

            // Add a comma if this is not the last satellite in the schedule
            if (i != satelliteSchedule.size() - 1) {
                file << ",";
            }

            file << std::endl;
        }

        // Close the array and object for the current ground station
        file << "]}";

        // Add a comma if this is not the last ground station in the schedule
        if (entry != *schedule.rbegin()) {
            file << ",";
        }

        file << std::endl;
    }

    // Close the file
    file.close();
    cout << "-- Fished creating json file  --" << endl;
}