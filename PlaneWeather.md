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


## Weather
Weather data can be obtained from any source on the internet.

http://weathersource.com/weather-api has a good API and a free account. 

## Solution
Implement this in python and host the code on github.
The application should be hosted on ec2 (or heroku)

## Solution Details
*  The backend should be written as a stand alone service that the UI can use
*  Create route at the back end using any simple means.
*  WebUI should show a map with source, destination and the route.
*  The weather forecast data should be rendered in any suitable format.
*  Weather data should be cached. 

## Extra
* It should be possible to provide a departure time in the past.

## Evaluation
* We are looking for a complete and deploybale solution
* Write tests
* Write a README if necessary
* Commit often to the repository.
* We encourage you to ask questions this challenge problem.  