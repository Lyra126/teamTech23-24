//
// Created by Clarissa Mac on 4/12/24.
//

#include "groundStation.h"


string groundStation::getId() const{
    return id;
}

float groundStation::getLat() const{
    return lat;
}

float groundStation::getLon() const{
    return lon;
}

float groundStation::getAlt() const{
    return alt;
}