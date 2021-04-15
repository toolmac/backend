# backend


## API Documentation

The following documents the current API endpoints


### announcements/get

This API returns an array of objects with the following properties each: 
- timestamp (in milliseconds)
- type (club, school, or other)
- origin (where the announcement originated from)
- originLink (link to origin, if any)
- title (announcement title)
- content (announcement content)
- announcer (person who created announcement)
- id (id of the announcement)

To use this endpoint, send a POST request with these optional parameters: 

- id (id of the announcement, if you are looking for a specific one)
- before (return filter announcements to before this timestamp in millis)
- after (return filter announcements to after this timestamp in millis)
- amount (amount of results to return, default is 10)

The result set is ordered by timestamp, in descending order

### calendar/get

This API returns an array of objects with the following properties each: 
- date (String of DD-MM-YYYY)
- day (integer day 1/2/3/4)
- type (String of "school", "break", or "weekend")
- semester (1,2,3,4,or 0)
- events (array of objects {date, startTime, endTime, name, and info})

The client sends a POST request with 2 fields: startdate object, comprising of {day, month, and year (all integers)} and days, which specifies
how many days in the calendar after `startdate` the server should send. Authorization header is required.

### profile/get

This API returns a JSON object with the following properties: 
- username
- email
- id
- firstname
- lastname
- bio

To use this endpoint, send a GET or POST request without any body, with a valid Authorization Header that has the JWT token. 

