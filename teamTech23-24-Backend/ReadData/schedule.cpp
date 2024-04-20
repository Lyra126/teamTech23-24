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
#include <thread>

// Define a mutex for synchronization
std::mutex mtx;
const int numGenerations = 5;
map<string, std::vector<std::pair<Satellite, int>>> createSchedule(vector<vector<Satellite>>& ranks);
void writeToFile(const std::map<std::string, std::vector<std::pair<Satellite, int>>>& schedule);
libsgp4::TimeSpan findDuration(Satellite &sat);
void processTLEData(const std::string& chunk, std::vector<Satellite>& rank1Satellites, std::vector<Satellite>& rank2Satellites, std::vector<Satellite>& rank3Satellites);

int main() {
//    std::string line1 = "CALSPHERE 1";
//    std::string line2 = "1 00900U 64063C   24109.11342102  .00001630  00000+0  16969-2 0  9990";
//    std::string line3 = "2 00900  90.2031  54.0901 0025958 155.9529 333.4496 13.74913474962776";
//    libsgp4::Tle tle(line1, line2, line3);
//    Satellite satellite(tle, libsgp4::DateTime::Now());
//    satellite.generatePasses();
//    satellite.assignRank();
//    cout << satellite.getName() << endl;
//    cout << satellite.getID() << endl;
//    cout << findDuration(satellite) << endl;
//    cout << findDuration(satellite).ToString() << endl;


    // Start the timer
    auto startTime = std::chrono::high_resolution_clock::now();
    libsgp4::DateTime currentTime = libsgp4::DateTime::Now();

    const std::string filename = "/Users/cc/Downloads/CSProjects/teamTech23-24/teamTech23-24-Backend/ReadData/celestrakList.txt";
    const int numThreads = 64; // Number of threads you want to use

    // Read the file and count the number of lines
    std::ifstream input(filename);
    std::stringstream buffer;
    buffer << input.rdbuf();

    // Count the number of lines in the file
    std::string fileContent = buffer.str();

    int numLines = std::count(fileContent.begin(), fileContent.end(), '\n') + 1;

    // Adjust the number of lines per thread to be divisible by 3
    int linesPerThread = (numLines + numThreads - 1) / numThreads; // Rounded up
    linesPerThread -= linesPerThread % 3; // Ensure divisibility by 3

    // Divide the file content into chunks for each thread
    std::vector<std::string> chunks;
    std::istringstream iss(fileContent);
    std::string chunk = "", temp;


    std::string line;
    int numberOfLines = 0;
    while (std::getline(iss, line)) {
        chunk += line + '\n'; // Add the line to the chunk
        numberOfLines++;
        if (numberOfLines >= linesPerThread) {
            numberOfLines = 0;
            chunks.push_back(chunk);
            chunk.clear();
        }
    }

    // Create vectors to hold satellites for each rank
    std::vector<Satellite> rank1Satellites, rank2Satellites, rank3Satellites;

   // cout << "-- Generating passes --" << endl;
    // Create threads and process TLE data in parallel
    std::vector<std::thread> threads;
    for (int i = 0; i < numThreads; ++i) {
        threads.emplace_back(processTLEData, std::ref(chunks.at(i)), std::ref(rank1Satellites), std::ref(rank2Satellites), std::ref(rank3Satellites));
    }

    // Join the threads
    for (auto& thread : threads) {
        thread.join();
    }

    // Merge the satellite vectors into a single vector
    vector<vector<Satellite>> ranks;
    ranks.push_back(rank1Satellites);
    ranks.push_back(rank2Satellites);
    ranks.push_back(rank3Satellites);

    cout << "-- Satellites all ranked --" << endl;

    auto schedule = createSchedule(ranks);
    writeToFile(schedule);
    // End the timer
    auto endTime = std::chrono::high_resolution_clock::now();

    // Calculate the duration in seconds
    std::chrono::duration<double> duration = endTime - startTime;
    std::cout << "Time taken: " << duration.count() << " seconds" << std::endl;

    //for testing purposes
    //std::map<std::string, std::vector<std::pair<Satellite, int>>>
    int totalNumSatellitesScheduled = 0;
    libsgp4::TimeSpan totalSatelliteDuration = libsgp4::TimeSpan(0,0,0,0,0);
    for(auto pair: schedule) {
        totalNumSatellitesScheduled += pair.second.size();
        for (auto sat: pair.second) {
            totalSatelliteDuration = totalSatelliteDuration + findDuration(sat.first);
        }
    }

    cout << "The generated schedule contains " << totalNumSatellitesScheduled << " satellites passes." << endl;
    //hours, mins, seconds
    cout << "Generated schedule length: " << totalSatelliteDuration << endl;
    return 0;
}

// Function to read TLE data from chunks, create satellite objects, and generate passes
void processTLEData(const std::string& chunk, std::vector<Satellite>& rank1Satellites, std::vector<Satellite>& rank2Satellites, std::vector<Satellite>& rank3Satellites){
    std::istringstream iss(chunk);
    std::string line1, line2, line3;


    // Read TLE data from the chunk
    while (getline(iss, line1) && getline(iss, line2) && getline(iss, line3)) {
        // Create a TLE object with line 1 and line 2 as arguments
        libsgp4::Tle tle(line1, line2, line3);
        // Create a satellite object with the TLE
        Satellite satellite(tle, libsgp4::DateTime::Now());

        // Generate passes for the satellite
        satellite.generatePasses();


        // Assign the rank to the satellite
        satellite.assignRank();

        // Add the satellite to the appropriate vector based on its rank (synchronization needed)
        std::lock_guard<std::mutex> lock(mtx);
        if(satellite.isLEO() && satellite.getNumPasses() > 0) {
            if (satellite.getRank() == 1)
                rank1Satellites.push_back(satellite);
            else if (satellite.getRank() == 2)
                rank2Satellites.push_back(satellite);
            else if (satellite.getRank() == 3)
                rank3Satellites.push_back(satellite);
        }
    }

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

std::map<std::string, std::vector<std::pair<Satellite, int>>> createRandomSchedule(std::map<std::string, std::vector<std::pair<Satellite, int>>> scheduleMap, std::vector<vector<Satellite>>& ranks) {
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
                std::vector<std::pair<int, int>> stationIndexes;

                // Loop over ground stations
                for (const auto& station : scheduleMap) {
                    // Save copy of each ground station’s schedule for ease of use
                    std::vector<std::pair<Satellite, int>> stationSchedule = station.second;

                    // Initialize index to -1, indicating no available position found yet
                    int index = -1;
                    int bestPass = 0;

                    // Loop over passes of the current satellite
                    for (int i = 0; i < currentSat.getPasses().size(); i++) {
                        // Compare first available position in the station's schedule
                        if (stationSchedule.empty() || currentSat.getPass(i).first < stationSchedule[0].first.getPass(i).first) {
                            index = 0;
                        } else {
                            for (size_t j = 1; j < stationSchedule.size(); ++j) {
                                if (currentSat.getStartTime() > stationSchedule[j - 1].first.getPass(i).second &&
                                    currentSat.getEndTime() < stationSchedule[j].first.getPass(i).first) {
                                    index = j;
                                    bestPass = i;
                                    break;
                                }
                            }
                        }
                    }
                    // Store the found index in stationIndexes along with the pass index
                    stationIndexes.push_back(std::make_pair(index, bestPass)); // Pair of index in ground station and pass index
                }

                int bestGS = 0;
                for (const auto& station : scheduleMap) {
                    auto currBestStation = scheduleMap.begin();
                    auto currStation = scheduleMap.begin();
                    for(size_t i = 0; i < stationIndexes.size(); i++) {
                        int bestIndex = stationIndexes[0].first;
                        bestGS = 0;
                        //if it can be scheduled at that ground station
                        if (stationIndexes[i].first != -1)
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
                            bestIndex = stationIndexes[i].first;
                        }
                    }
                }
                //once best ground station is identified for the
                if (bestGS >= 0 && stationIndexes[bestGS].first >= 0 && bestGS < scheduleMap.size()) {
                    // Retrieve the schedule vector for the ground station
                    auto station = scheduleMap.begin();
                    std::advance(station, bestGS);
                    auto& groundStationSchedule = const_cast<std::vector<std::pair<Satellite, int>>&>(station->second);
                    // Insert the satellite into the schedule at the identified index
                    //cout << "Satellite " << currentSat.getName() << " inserted into ground station " << station->first << " at index " << stationIndexes[bestGS].first << endl; // Debug output
                    groundStationSchedule.insert(groundStationSchedule.begin() + stationIndexes[bestGS].first, std::make_pair(currentSat, stationIndexes[bestGS].second));
                }
                temp[randNum] = nullptr;
                accessedIndices.insert(randNum);
            }
        }
        //remove all elements to look at next ranked tier
        accessedIndices.clear();
    }
    cout << "-- Random Schedule is created --" << endl;
    return scheduleMap;
}

libsgp4::TimeSpan findDuration(Satellite &sat) {
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

int calculateFitness(const map<string, std::vector<std::pair<Satellite, int>>>& sched1, const map<string, std::vector<std::pair<Satellite, int>>> sched2) {

    libsgp4::TimeSpan duration_map_1 = libsgp4::TimeSpan(0,0,0,0,0);
    libsgp4::TimeSpan duration_map_2 = libsgp4::TimeSpan(0,0,0,0,0);
    int sched1Score = 0, sched2Score = 0;
    float totalSched1Ranks = 0, totalSched2Ranks = 0, sched1AvgRank = 0, sched2AvgRank = 0;
    int sched1count = 0, sched2count = 0;

    // map 1
    for (auto & it : sched1) {
        vector<std::pair<Satellite, int>> currentGSSchedule = it.second;
        for(auto & j : currentGSSchedule) {
            duration_map_1.Add(findDuration(j.first));
            totalSched1Ranks += j.first.getRank();
            sched1count += 1;
        }
    }

    // map 2
    for (auto & it : sched2) {
        vector<std::pair<Satellite, int>> currentGSSchedule = it.second;
        for(auto & j : currentGSSchedule) {
            duration_map_2.Add(findDuration(j.first)); // implement add in datetime.h
            totalSched2Ranks += static_cast<float>(j.first.getRank());
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

bool areSchedulesEqual(const map<string, vector<std::pair<Satellite, int>>>& map1, const map<string, vector<std::pair<Satellite, int>>>& map2) {
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


map<string, vector<std::pair<Satellite, int>>> combineSchedules(int preferred, const map<string, vector<std::pair<Satellite, int>>>& scheduleMap1, const map<string, vector<std::pair<Satellite, int>>>& scheduleMap2) {
    cout << "-- Combining schedules --" << endl;
    //in the rare case that they are equal, return scheduleMap1
    if (areSchedulesEqual(scheduleMap1, scheduleMap2)) {
        cout << "Schedules are equal, returning schedule 1" << endl;
        return scheduleMap1;
    }
    // Choose the more optimal schedule
    const map<string, vector<std::pair<Satellite, int>>>& optimalScheduleMap = (preferred == 1) ? scheduleMap1 : scheduleMap2;
    const map<string, vector<std::pair<Satellite, int>>>& lessOptimalScheduleMap = (preferred == 1) ? scheduleMap2 : scheduleMap1;

// Create a copy of the optimal schedule map
    map<string, vector<std::pair<Satellite, int>>> combinedScheduleMap = optimalScheduleMap;

// Iterate through the optimal schedule to look for gaps and lower priority satellites
    for (auto& it1 : optimalScheduleMap) {
        const string& stationName = it1.first;
        vector<std::pair<Satellite, int>>& optimalSchedule = combinedScheduleMap[stationName];

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
            if (it2->second[i].first.getRank() < it1.second[i].first.getRank()) {
                // Replace the lower rank satellite in the optimal schedule with the one from the less optimal schedule
                optimalSchedule[i] = it2->second[i];
                break; // Break the loop after finding a suitable replacement
            }

            // Calculate the gap between current and previous satellite passes
            libsgp4::DateTime currentStartTime = it1.second[i].first.getPass(it1.second[i].second).first;
            libsgp4::DateTime previousEndTime = optimalSchedule[i - 1].first.getPass(optimalSchedule[i - 1].second).second;
            libsgp4::TimeSpan gap = libsgp4::TimeSpan(currentStartTime.Day(),currentStartTime.Hour(),currentStartTime.Minute(),currentStartTime.Second(),currentStartTime.Microsecond()) - libsgp4::TimeSpan(previousEndTime.Day(),previousEndTime.Hour(),previousEndTime.Minute(),previousEndTime.Second(),previousEndTime.Microsecond());;
            // Check if the gap is within the desired range (8-20 minutes)
            if (gap.Minutes() >= 8 && gap.Minutes() <= 20) {
                    // Loop through the satellite passes in it2->second
                    for (int i = 0; i < it2->second.size(); i++) {
                        // Check if i is within bounds of optimalSchedule
                        if (i >= 1 && i < optimalSchedule.size()) {
                            auto satellitePass = it2->second[i];
                            // Ensure satellitePass.first.getPass(satellitePass.second) is a valid index
                            if (satellitePass.second >= 0 && satellitePass.second < satellitePass.first.getNumPasses()) {
                                // Ensure optimalSchedule[i - 1] is within bounds
                                if (i - 1 >= 0 && i - 1 < optimalSchedule.size()) {
                                    // Ensure optimalSchedule[i] is within bounds
                                    if (i < optimalSchedule.size()) {
                                        // Compare satellite pass timings and update optimalSchedule if it fits the gap
                                        if (satellitePass.first.getPass(satellitePass.second).first >= optimalSchedule[i - 1].first.getPass(optimalSchedule[i - 1].second).second &&
                                            satellitePass.first.getPass(satellitePass.second).second <= optimalSchedule[i].first.getPass(optimalSchedule[i].second).first) {
                                            optimalSchedule[i] = std::make_pair(satellitePass.first, satellitePass.second);
                                        }
                                    }
                                }
                            }
                        }

                }
            }
        }
    }

    cout << "-- Schedules are combined --" << endl;
    return combinedScheduleMap;
}

map<string, std::vector<std::pair<Satellite, int>>> createSchedule(vector<vector<Satellite>>& ranks) {
    cout << "-- starting to create schedule... --" << endl;
    map<string, std::vector<std::pair<Satellite, int>>> emptyMap, tempSchedule;
    std::vector<std::pair<Satellite, int>> emptyVector;
    std::vector<std::pair<Satellite, int>>* vectorPtr = &emptyVector;
    emptyMap["Sarasota"] = *vectorPtr;
    emptyMap["Austin"] = *vectorPtr;
    emptyMap["Tokyo"] = *vectorPtr;

    int preferred = 0;

    map<string, std::vector<std::pair<Satellite, int>>> optimalSchedule = createRandomSchedule(emptyMap, ranks);

    for(int i = 0; i < numGenerations; i++){
        cout << "On generation " << i << endl;
        tempSchedule = createRandomSchedule(emptyMap, ranks);
        preferred = calculateFitness(tempSchedule, optimalSchedule);
        cout << "Preferred: " << preferred << endl;
        optimalSchedule = combineSchedules(preferred, tempSchedule, optimalSchedule);
    }
    cout << "-- Schedule created --" << endl;
    return optimalSchedule;
}

void writeToFile(const std::map<std::string, std::vector<std::pair<Satellite, int>>>& schedule){
    cout << "-- Starting to write schedule to json file  --" << endl;
    std::ofstream file("satelliteSchedule.json");

    // Check if the file is open
    if (!file.is_open()) {
        std::cerr << "Error: Unable to open file: satelliteSchedule.json" << std::endl;
        return;
    }

    // Write the opening bracket for the JSON array
    file << "[" << std::endl;

    // Iterate through each ground station in the schedule map
    auto it = schedule.begin();
    while (it != schedule.end()) {
        const std::string& groundStationName = it->first;
        const std::vector<std::pair<Satellite, int>>& satelliteSchedule = it->second;

        // Write the JSON object for each ground station
        file << "  {\"name\": \"" << groundStationName << "\", \"schedule\": [" << std::endl;

        // Iterate through each satellite in the ground station's schedule
        for (size_t i = 0; i < satelliteSchedule.size(); ++i) {
            const std::pair<Satellite, int>& satellitePair = satelliteSchedule[i];
            const Satellite& satellite = satelliteSchedule[i].first;
            auto satellitePass = satelliteSchedule[i].first.getPass(satelliteSchedule[i].second);

            // Write the JSON object for each satellite
            file << R"(    {"name": ")" << satellite.getName() << "\", "
                 << R"("ID": ")" << satellite.getID() << "\", "
                 << R"("startTime": ")" << satellitePass.first << "\", "
                 << R"("endTime": ")" << satellitePass.second << "\", "
                 << R"("startTimeLat": ")" << satellite.getStartTimeLatitude() << "\", "
                 << R"("startTimeLong": ")" << satellite.getStartTimeLongitude() << "\", "
                 << R"("endTimeLat": ")" << satellite.getEndTimeLatitude() << "\", "
                 << R"("endTimeLong": ")" << satellite.getEndTimeLongitude() << "\"}";

            // Add comma if it's not the last satellite
            if (i != satelliteSchedule.size() - 1)
                file << ",";
            file << std::endl;
        }

        // Write the closing bracket for the schedule array
        file << "  ]}";

        // Add comma if it's not the last ground station
        ++it;
        if (it != schedule.end())
            file << ",";

        file << std::endl;
    }

    // Write the closing bracket for the JSON array
    file << "]" << std::endl;

    // Close the file
    file.close();

    cout << "-- Finished creating json file  --" << endl;
}
