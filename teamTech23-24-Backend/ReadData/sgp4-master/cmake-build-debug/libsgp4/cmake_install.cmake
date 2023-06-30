# Install script for directory: /Users/rebeccadiaz/Desktop/sgp4-master/libsgp4

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/Users/rebeccadiaz/Desktop/sgp4-master/cmake-build-debug/install")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Debug")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/Library/Developer/CommandLineTools/usr/bin/objdump")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE SHARED_LIBRARY FILES "/Users/rebeccadiaz/Desktop/sgp4-master/cmake-build-debug/libsgp4/libsgp4s.dylib")
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libsgp4s.dylib" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libsgp4s.dylib")
    if(CMAKE_INSTALL_DO_STRIP)
      execute_process(COMMAND "/Library/Developer/CommandLineTools/usr/bin/strip" -x "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/libsgp4s.dylib")
    endif()
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/libsgp4" TYPE FILE FILES
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/CoordGeodetic.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/CoordTopocentric.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/DateTime.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/DecayedException.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/Eci.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/Globals.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/Observer.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/OrbitalElements.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/SatelliteException.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/SGP4.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/SolarPosition.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/TimeSpan.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/TleException.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/Tle.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/Util.h"
    "/Users/rebeccadiaz/Desktop/sgp4-master/libsgp4/Vector.h"
    )
endif()

