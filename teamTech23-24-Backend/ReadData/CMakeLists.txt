
CMAKE_MINIMUM_REQUIRED(VERSION 3.13.4)
project(teamTech23-24-Backend)

if (POLICY CMP0054)
    cmake_policy(SET CMP0054 NEW)
endif()

if(CMAKE_INSTALL_PREFIX_INITIALIZED_TO_DEFAULT)
    set(CMAKE_INSTALL_PREFIX "${CMAKE_BINARY_DIR}/install" CACHE PATH "..." FORCE)
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if (NOT CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wextra")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wshadow")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wnon-virtual-dtor")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pedantic")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wno-long-long")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wcast-align")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wsign-conversion")
endif(NOT CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")

set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)

include_directories(sgp4-master)

set(DIR "sgp4-master/libsgp4")

set(SOURCE ${DIR}/CoordGeodetic.h      ${DIR}/CoordGeodetic.cc
           ${DIR}/CoordTopocentric.h   ${DIR}/CoordTopocentric.cc
           ${DIR}/DateTime.h           ${DIR}/DateTime.cc
           ${DIR}/DecayedException.h   ${DIR}/DecayedException.cc
           ${DIR}/Globals.h            ${DIR}/Globals.cc
           ${DIR}/OrbitalElements.h    ${DIR}/OrbitalElements.cc
           ${DIR}/Tle.h                ${DIR}/Tle.cc
           ${DIR}/TleException.h       ${DIR}/TleException.cc
           ${DIR}/Observer.h           ${DIR}/Observer.cc
           ${DIR}/SatelliteException.h ${DIR}/SatelliteException.cc
           ${DIR}/SolarPosition.h      ${DIR}/SolarPosition.cc
           ${DIR}/Util.h               ${DIR}/Util.cc
           ${DIR}/TimeSpan.h           ${DIR}/TimeSpan.cc
           ${DIR}/SGP4.h               ${DIR}/SGP4.cc
           ${DIR}/Eci.h                ${DIR}/Eci.cc
           ${DIR}/Vector.h             ${DIR}/Vector.cc
           Satellite.cpp schedule.cpp Satellite.h)



add_executable(TestSGP4 ${SOURCE})

