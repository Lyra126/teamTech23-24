//
// Created by Clarissa Mac on 4/12/24.
//

#ifndef TEAMTECH23_24_BACKEND_GROUNDSTATION_H
#define TEAMTECH23_24_BACKEND_GROUNDSTATION_H
using namespace std;
#include <string>

class groundStation {
    private:
        std::string id;
        float lat;
        float lon;
        float alt;

    public:
        groundStation(string id, float lat, float lon, float alt){
            this->id = id;
            this->lat = lat;
            this->lon = lon;
            this->alt = alt;
        }

        string getId() const;
        float getLat() const;
        float getLon() const;
        float getAlt() const;
};


#endif //TEAMTECH23_24_BACKEND_GROUNDSTATION_H
