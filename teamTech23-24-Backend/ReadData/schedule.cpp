#include <iostream>
#include <vector>
#include <fstream>
#include "Satellite.h"
#include "libsgp4/Tle.h"
#include "libsgp4/DateTime.h"
#include <queue>

void createSchedule(vector<Satellite>& schedule, vector<priority_queue<Satellite>>& heaps);

// returns vector of min heap priority queues and takes in 1 satellite object,
// & vector of priority_queue that it needs to be added into
// void addSatelliteToHeaps(vector<priority_queue<Satellite, vector<int>, satComparator>>& heap, Satellite& sat); implemented into main function
//operator overload to be able to compare times in satellite class, change data type of the things in priority_queue later
int main() {

    /*
    // Hard code test:
    // Name: Starlink SSC: 47862  test starlink from Andrew
    libsgp4::DateTime time = libsgp4::DateTime(2022, 10, 19, 13, 50, 45);
    std::string line1 = "1 47862U 21021U   22292.11715278 -.00011170  00000-0 -74838-3 0  2923";
    std::string line2 = "2 47862  53.0547  57.3135 0001386  72.2469 132.6029 15.06412172    18";
    libsgp4::Tle obj1(line1, line2);
    Satellite satellite(obj1, time);
    satellite.generatePasses();
    satellite.toString();
    satellite.assignRank();
    vector<Satellite> schedule;
    schedule.push_back(satellite);
    schedule.push_back(satellite);
    */


    // DEFAULT DATE TIME
    // needs to be military udt time
    libsgp4::DateTime currentTime = libsgp4::DateTime::Now();

    // Initialize variables for reading input file
    //int numRanks = 3; //!!!change later!!!
    std::string buffer;
    //updated March 31,2022 1:48 pm est
    std::fstream input("/Users/cc/Downloads/teamTech23-24/teamTech23-24-Backend/ReadData/celestrakList.txt"); // The file of satellites is found in the debug folder
    string line1, line2;

    //Initialize variables for scheduler
    //vector will be a temporary data type to hold satellites, need to decide on a better container to store data
    //(maybe a priority queue/heap)
    vector<Satellite> schedule;

    vector<priority_queue<Satellite>> heaps;
    priority_queue<Satellite> queue1;
    priority_queue<Satellite> queue2;
    priority_queue<Satellite> queue3;
    heaps.push_back(queue1);
    heaps.push_back(queue2);
    heaps.push_back(queue3);

    // Read in data from active.txt file until you reach the end of the file
    while(getline(input, buffer)){

        //read TLE lines
        getline(input, line1);
        getline(input, line2);
        //line1.pop_back(); // Gets rid of carriage return character
        //line2.pop_back(); // Gets rid of carriage return character
        //create a TLE object with line 1 and line 2 as arguments
        libsgp4::Tle tle(line1, line2);
        //create a satellite object with the tle as an argument
        Satellite satellite(tle, currentTime);

        if(!satellite.getConstrSuccess()){
            continue;
        }

        if(satellite.isLEO()){
            satellite.generatePasses();
            // Satellite does not pass over
            if(satellite.getNumPasses() == 0){
                continue;
            }
            satellite.toString();
            satellite.assignRank();

            //satellites.push_back(satellite);
            //add satellite object to a max heap prioritized by ranking
            if(satellite.getRank() == 1)
                heaps[0].push(satellite);
            else if(satellite.getRank() == 2)
                heaps[1].push(satellite);
            else if(satellite.getRank() == 3)
                heaps[2].push(satellite);
        }
    }

    createSchedule(schedule, heaps);

    // Create json file
    std::ofstream file("satelliteSchedule.json");

    for(int i = 0; i < schedule.size(); i++){
        file << "{ \"name\":\"" << schedule.at(i).getName() << "\" , ";
        file << "\"startTime\":\"" << schedule.at(i).getStartString() << "\" , ";
        file << "\"endTime\":\"" << schedule.at(i).getEndString() << "\" , ";
        file << "\"startLat\":\"" << schedule.at(i).getStartTimeLatitude() << "\" , ";
        file << "\"startLong\":\"" << schedule.at(i).getStartTimeLongitude() << "\" , ";
        file << "\"endLat\":\"" << schedule.at(i).getEndTimeLatitude() << "\" , ";
        file << "\"endLong\":\"" << schedule.at(i).getEndTimeLongitude() << "\" }" << endl;
    }

    return 0;
}

void createSchedule(vector<Satellite>& schedule, vector<priority_queue<Satellite>>& heaps){
    schedule.push_back(heaps[0].top());
    heaps[0].pop();

    for(int heap_num = 0; heap_num < 3; heap_num++) {
        while (heaps[heap_num].size() > 0) {
            int index = 0;
            Satellite sat = heaps[heap_num].top();
            heaps[heap_num].pop();

            // Make new satellite with next pass
            Satellite update(sat);
            if(update.setStartAndEndTime()){
                heaps[heap_num].push(update);
            }

            // Find position in schedule
            while (index < schedule.size()) {
                if (sat.getStartTime() <= schedule[index].getStartTime() )
                    break;
                else
                    index++;
            }

            // Check for conflicts
            if(sat.getStartTime() == schedule[index].getStartTime() )
                continue;
            auto it = schedule.begin() + index;
            if (index == 0) {
                if (sat.getEndTime() < schedule[index].getStartTime()) {
                    schedule.insert(it, sat);
                }
            } else if (index == schedule.size()) {
                if(sat.getStartTime() > schedule[index-1].getEndTime() ){
                    schedule.push_back(sat);
                }

            } else {
                if(sat.getStartTime() > schedule[index-1].getEndTime()  &&
                   sat.getEndTime() < schedule[index].getStartTime() ){
                    schedule.insert(it, sat);
                }
            }
        }
    }
}
