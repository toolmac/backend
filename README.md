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

### profile/get

This API returns a JSON object with the following properties: 
- username
- email
- id
- firstname
- lastname
- bio

To use this endpoint, send a GET or POST request without any body, with a valid Authorization Header that has the JWT token. 

