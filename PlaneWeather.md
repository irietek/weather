# Background

The expected weather conditions along the planned route of a plane are essential for a pilot.
As a pilot I would like to have a web application that gives me this forecast at a requested granularility. 


# Problem Definition
Given a source, a destination and a time of departure create a weather forecast report for the journey. 

## Inputs
*  Source [as Latitude / Longitude or Airport Code]
*  Destination 
*  Time of Departure
*  Average Speed
*  Time Interval (in hours)

## Outputs
Create a weather forecast report once every "Time Interval" 
The report should include Temperature, humidity, windspeed and other information of note.


*  